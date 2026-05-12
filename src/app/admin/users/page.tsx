"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { userService } from "@/services/userService";
import { Search, UserCheck, UserX, Info, X } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      await userService.updateUserVerification(id, !currentStatus);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_verified: !currentStatus } : u));
    } catch (err) {
      alert("更新失敗");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.real_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.student_id?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <AdminLayout><div className="p-20 text-center font-mono animate-pulse">LOADING_MEMBER_DIRECTORY...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">社員身分管理</h1>
            <p className="text-sm font-serif text-muted">檢視社員資料、審核入社身分與權限設定。</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border px-4 py-2.5 rounded-xl text-xs font-serif outline-none focus:border-accent transition-all pl-10"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <Search className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Member_Name</th>
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Student_ID</th>
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Verification</th>
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                        {user.real_name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="text-sm font-serif font-bold">{user.real_name || "未設定"}</div>
                        <div className="text-[10px] font-mono text-muted/60">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-mono text-xs text-muted">
                    {user.student_id || "N/A"}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[9px] font-mono px-2 py-1 rounded uppercase font-bold border ${
                      user.is_verified ? "border-emerald-500/30 text-emerald-600 bg-emerald-50" : "border-amber-500/30 text-amber-600 bg-amber-50"
                    }`}>
                      {user.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-surface border border-border rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-background transition-all"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => handleToggleVerify(user.id, user.is_verified)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${
                          user.is_verified ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        }`}
                      >
                        {user.is_verified ? "Unverify" : "Verify"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center text-muted font-serif italic">找不到符合條件的社員</div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface border border-border w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-display italic">社員詳細資料</h2>
                <button onClick={() => setSelectedUser(null)} className="text-muted hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Personal_Info</h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-muted font-mono text-[10px] uppercase">Real Name</div>
                    <div className="font-serif">{selectedUser.real_name || "N/A"}</div>
                    <div className="text-muted font-mono text-[10px] uppercase">Student ID</div>
                    <div className="font-mono">{selectedUser.student_id || "N/A"}</div>
                    <div className="text-muted font-mono text-[10px] uppercase">Phone</div>
                    <div className="font-mono">{selectedUser.phone || "N/A"}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Emergency_Contact</h3>
                  <div className="bg-background/50 p-4 rounded-2xl">
                    <p className="text-xs text-muted italic">此區塊將顯示從 user_profiles.full_details 解析出的緊急聯絡資訊。</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background p-6 flex justify-end border-t border-border">
              <button onClick={() => setSelectedUser(null)} className="px-8 py-2.5 bg-surface border border-border text-foreground rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
