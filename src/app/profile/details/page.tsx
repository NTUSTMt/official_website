"use client";

import React, { useState } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { mockUserProfile } from "@/data/profile";

export default function ProfileDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(mockUserProfile);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would hit an API
  };

  const Field = ({ label, value, name, type = "text", section = "details" }: { label: string, value: string | boolean, name: string, type?: string, section?: string }) => (
    <div className="py-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <label className="text-xs font-mono text-muted uppercase tracking-widest md:w-48">{label}</label>
      {isEditing ? (
        <input 
          type={type === "boolean" ? "checkbox" : type}
          className="flex-1 max-w-md bg-surface border border-border px-4 py-2 rounded-xl font-serif text-foreground outline-none focus:border-accent transition-colors"
          defaultValue={value.toString()}
        />
      ) : (
        <div className="flex-1 font-serif text-lg">{value.toString()}</div>
      )}
    </div>
  );

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display italic mb-4">詳細資料</h1>
            <p className="text-lg font-serif text-muted">
              所有資料皆為選填，用於加速未來活動報名與保險辦理。
            </p>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-8 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all ${
              isEditing ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-surface border border-border hover:border-accent"
            }`}
          >
            {isEditing ? "SAVE_CHANGES" : "EDIT_PROFILE"}
          </button>
        </header>

        <div className="space-y-12">
          {/* Basic Personal Info */}
          <section>
            <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-8">Personal_Info</div>
            <div className="bg-background rounded-3xl p-2 md:p-8">
              <Field label="真實姓名" value={user.details.realName} name="realName" />
              <Field label="性別" value={user.details.gender} name="gender" />
              <Field label="出生年月日" value={user.details.birthDate} name="birthDate" type="date" />
              <Field label="是否為本國人" value={user.details.isCitizen ? "是" : "否"} name="isCitizen" />
              <Field label="證件種類" value={user.details.idType} name="idType" />
              <Field label="證件號碼" value={user.details.idNumber} name="idNumber" />
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-8">Contact_Details</div>
            <div className="bg-background rounded-3xl p-2 md:p-8">
              <Field label="聯絡電話" value={user.details.phone} name="phone" />
              <Field label="聯絡信箱" value={user.details.email} name="email" />
              <Field label="聯絡地址" value={user.details.address} name="address" />
              <Field label="LINE ID" value={user.details.lineId} name="lineId" />
              <Field label="學號/單位" value={user.details.studentId} name="studentId" />
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-8">Emergency_Contact</div>
            <div className="bg-background rounded-3xl p-2 md:p-8">
              <Field label="聯絡人姓名" value={user.details.emergencyContact.name} name="ec_name" />
              <Field label="聯絡人電話" value={user.details.emergencyContact.phone} name="ec_phone" />
              <Field label="關係" value={user.details.emergencyContact.relationship} name="ec_rel" />
              <Field label="聯絡地址" value={user.details.emergencyContact.address} name="ec_addr" />
            </div>
          </section>
        </div>

        <footer className="mt-16 pt-12 border-t border-border flex items-center gap-4">
          <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
          <p className="text-xs font-mono text-muted/40 uppercase tracking-[0.2em]">
            您的個人隱私資料僅用於社團保險與出團報名。
          </p>
        </footer>
      </div>
    </ProfileLayout>
  );
}
