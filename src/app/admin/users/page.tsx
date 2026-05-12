"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { mockUsers, UserSummary } from "@/data/users";

export default function UserAdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.details.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.details.realName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleVerify = (uId: string) => {
    setUsers(prev => prev.map(u => u.id === uId ? { ...u, isVerified: !u.isVerified } : u));
    if (selectedUser?.id === uId) {
      setSelectedUser(prev => prev ? { ...prev, isVerified: !prev.isVerified } : null);
    }
  };

  const UserDetailModal = ({ user }: { user: UserSummary }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
        <button 
          onClick={() => setSelectedUser(null)}
          className="absolute top-8 right-8 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-surface transition-colors"
        >
          ✕
        </button>

        <header className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-border pb-10">
          <img src={user.avatar} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" alt={user.name} />
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <h2 className="text-3xl font-display italic">{user.name}</h2>
              <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border ${
                user.isVerified ? "border-emerald-500/20 text-emerald-600 bg-emerald-50" : "border-amber-500/20 text-amber-600 bg-amber-50"
              }`}>
                {user.isVerified ? "VERIFIED_MEMBER" : "UNVERIFIED"}
              </span>
            </div>
            <p className="text-sm font-serif text-muted mb-4">{user.bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="text-[10px] font-mono text-muted uppercase tracking-widest">UID: {user.id}</div>
              <div className="text-[10px] font-mono text-muted uppercase tracking-widest">Joined: {user.joinDate}</div>
            </div>
          </div>
          <button 
            onClick={() => handleToggleVerify(user.id)}
            className={`px-6 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${
              user.isVerified ? "bg-red-50 text-red-500 border border-red-200" : "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
            }`}
          >
            {user.isVerified ? "Revoke Verification" : "Verify Member"}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-sm font-mono text-accent font-bold uppercase tracking-widest border-l-2 border-accent pl-3">Personal_Info</h3>
            <div className="space-y-4">
              <DetailItem label="真實姓名" value={user.details.realName} />
              <DetailItem label="性別" value={user.details.gender} />
              <DetailItem label="出生年月日" value={user.details.birthDate} />
              <DetailItem label="學號/單位" value={user.details.studentId} />
              <DetailItem label="Line ID" value={user.details.lineId} />
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-mono text-accent font-bold uppercase tracking-widest border-l-2 border-accent pl-3">Emergency_Contact</h3>
            <div className="space-y-4">
              <DetailItem label="聯絡人" value={user.details.emergencyContact.name} />
              <DetailItem label="電話" value={user.details.emergencyContact.phone} />
              <DetailItem label="關係" value={user.details.emergencyContact.relationship} />
              <DetailItem label="地址" value={user.details.emergencyContact.address} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center border-b border-border/30 pb-2">
      <span className="text-[10px] font-mono text-muted uppercase">{label}</span>
      <span className="text-sm font-serif">{value}</span>
    </div>
  );

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display italic mb-2">會員管理系統</h1>
          <p className="text-sm font-serif text-muted">檢視社員詳細資料、審核會員身分並管理通訊錄。</p>
        </header>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
            <input 
              type="text" 
              placeholder="搜尋姓名、學號或暱稱..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border px-12 py-3 rounded-2xl font-serif text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-surface border border-border px-4 py-3 rounded-2xl font-mono text-[10px] uppercase tracking-widest outline-none">
              <option>All Status</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>
            <button className="px-6 bg-surface border border-border rounded-2xl text-[10px] font-mono uppercase tracking-widest">Export All</button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Member</th>
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Student_ID</th>
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Join_Date</th>
                <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background/50 transition-colors group">
                  <td className="px-6 py-6 flex items-center gap-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    <div>
                      <div className="text-sm font-serif font-bold text-foreground">{user.name}</div>
                      <div className="text-[10px] font-mono text-muted/60">{user.details.realName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-mono text-xs text-muted">
                    {user.details.studentId}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[9px] font-mono px-2 py-1 rounded border tracking-widest font-bold uppercase ${
                      user.isVerified ? "border-emerald-500/20 text-emerald-600 bg-emerald-50" : "border-amber-500/20 text-amber-600 bg-amber-50"
                    }`}>
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-mono text-[10px] text-muted">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 bg-background border border-border rounded-xl text-[10px] font-mono uppercase tracking-widest hover:border-accent transition-all"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Overlay */}
        {selectedUser && <UserDetailModal user={selectedUser} />}
      </div>
    </AdminLayout>
  );
}
