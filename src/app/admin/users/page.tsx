"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { memberService } from "@/services/memberService";
import { UserProfile } from "@/services/userService";
import { Search, User, CreditCard, ShieldCheck, Mail, GraduationCap, Phone, Info, X } from "lucide-react";

export default function AdminUsersPage() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const data = await memberService.getMembers();
        setMembers(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    (m.real_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.student_id?.includes(searchTerm))
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-20 text-center font-mono animate-pulse text-xs tracking-widest text-muted">
          LOADING_MEMBER_DATABASE...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">會員管理中心</h1>
            <p className="text-sm font-serif text-muted">Excel 式高效管理介面：快速搜尋、身分審核與財務記錄。</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
            <input 
              type="text" 
              placeholder="搜尋姓名或學號..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border pl-12 pr-4 py-3 rounded-2xl text-sm outline-none focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-border">
                  <th className="px-8 py-5 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Student_ID</th>
                  <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Member_Identity</th>
                  <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Department</th>
                  <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Balance</th>
                  <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-background/50 transition-colors group">
                    <td className="px-8 py-6 text-xs font-mono text-foreground font-bold">{member.student_id || "N/A"}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shadow-inner">
                          {member.real_name?.[0] || "?"}
                        </div>
                        <div>
                          <div className="text-sm font-display italic font-bold">{member.real_name || "未填寫"}</div>
                          <div className="text-[10px] font-mono text-muted/60">{member.nickname || "No Nickname"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3 h-3 text-muted/40" />
                        <span className="text-xs font-mono text-muted uppercase">{member.department || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <select 
                        value={member.membership_status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as any;
                          try {
                            await memberService.updateMember(member.id, { membership_status: newStatus });
                            setMembers(prev => prev.map(m => m.id === member.id ? { ...m, membership_status: newStatus } : m));
                          } catch (err) {
                            alert("更新失敗");
                          }
                        }}
                        className={`text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border bg-transparent outline-none cursor-pointer transition-all ${
                          member.membership_status === 'active' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 
                          member.membership_status === 'unpaid' ? 'border-red-200 text-red-500 bg-red-50' :
                          'border-border text-muted'
                        }`}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="active">Active</option>
                        <option value="alumni">Alumni</option>
                        <option value="external">External</option>
                      </select>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold ${member.balance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {member.balance < 0 ? `-$${Math.abs(member.balance)}` : `$${member.balance}`}
                        </span>
                        <button 
                          onClick={async () => {
                            const amount = prompt(`調整 ${member.real_name} 的金額 (目前 $${member.balance}):\n輸入正值為增加，負值為扣除`);
                            if (amount && !isNaN(Number(amount))) {
                              try {
                                await memberService.updateBalance(member.id, Number(amount));
                                setMembers(prev => prev.map(m => m.id === member.id ? { ...m, balance: m.balance + Number(amount) } : m));
                              } catch (err) {
                                alert("更新失敗");
                              }
                            }
                          }}
                          className="p-1.5 text-muted hover:text-accent transition-colors bg-background rounded-lg border border-border/50"
                        >
                          <CreditCard className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => setSelectedMember(member)}
                        className="text-[10px] font-mono text-muted hover:text-accent uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 underline decoration-accent/30 underline-offset-4"
                      >
                        Details_&_History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMembers.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm font-serif text-muted italic">找不到符合條件的社員</p>
                <button onClick={() => setSearchTerm("")} className="mt-4 text-[10px] font-mono text-accent uppercase tracking-widest hover:underline">Clear Search</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface border border-border w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 md:p-12 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-accent/20">
                    {selectedMember.real_name?.[0] || "?"}
                  </div>
                  <div>
                    <h2 className="text-3xl font-display italic">{selectedMember.real_name || "未填寫"}</h2>
                    <p className="text-xs font-mono text-muted uppercase tracking-widest">{selectedMember.student_id || "No Student ID"}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-background rounded-full transition-colors">
                  <X className="w-6 h-6 text-muted" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column: Basic Info */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Member_Profile</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-3.5 h-3.5 text-muted" />
                        <span className="text-xs font-mono">{selectedMember.phone || "No Phone Registered"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-3.5 h-3.5 text-muted" />
                        <span className="text-xs font-serif">{selectedMember.department || "No Department Info"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShieldCheck className={`w-3.5 h-3.5 ${selectedMember.membership_status === 'active' ? 'text-emerald-500' : 'text-muted'}`} />
                        <span className="text-xs font-mono uppercase font-bold tracking-wider">{selectedMember.membership_status} Member</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Emergency_Contact</h3>
                    <div className="bg-background/50 p-6 rounded-2xl border border-border/50">
                      <div className="text-sm font-serif font-bold mb-1">{selectedMember.emergency_contact_name || "未填寫"}</div>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted">
                        <Phone className="w-3 h-3" />
                        {selectedMember.emergency_contact_phone || "無電話資訊"}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Skills & Balance */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Technical_Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills && selectedMember.skills.length > 0 ? (
                        selectedMember.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-accent/5 text-accent border border-accent/10 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-serif text-muted italic">暫無登記專業技能</span>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Financial_Summary</h3>
                    <div className={`p-6 rounded-2xl border ${selectedMember.balance < 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                      <div className="text-[9px] font-mono text-muted uppercase mb-1">Current_Balance</div>
                      <div className={`text-2xl font-mono font-bold ${selectedMember.balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {selectedMember.balance < 0 ? `-$${Math.abs(selectedMember.balance)}` : `$${selectedMember.balance}`}
                      </div>
                      <p className="text-[9px] font-serif text-muted mt-2 leading-tight">
                        {selectedMember.balance < 0 ? "該社員目前尚有欠費，請提醒其繳納。" : "該社員帳戶狀態正常。"}
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div className="bg-background p-8 flex justify-end border-t border-border">
              <button 
                onClick={() => setSelectedMember(null)} 
                className="px-10 py-3 bg-foreground text-background rounded-2xl text-[10px] font-mono uppercase tracking-[0.2em] font-bold hover:bg-accent hover:text-white transition-all shadow-xl shadow-foreground/10"
              >
                Close_Record
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
