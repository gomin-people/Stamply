"use client";
import { useRef, useState } from "react";
import { ImageIcon, Link2, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  locationUrl: string;
  production: string;
  contactPhone: string;
  contactEmail: string;
  startTime: string;
  endTime: string;
  operatingRemarks: string;
  posterImageUrl: string;
};

const initialForm: FormState = {
  title: "",
  startDate: "",
  endDate: "",
  location: "",
  locationUrl: "",
  production: "",
  contactPhone: "",
  contactEmail: "",
  startTime: "",
  endTime: "",
  operatingRemarks: "",
  posterImageUrl: "",
};

export default function EventInfoForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    console.log(e.target.files?.[0]);
    setPosterPreview(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <form>
        <div className="flex gap-8">
          {/* 포스터 이미지 */}
          <div className="w-64 shrink-0">
            <div className="mb-1.5 flex items-center gap-1 text-sm font-medium">
              포스터 이미지
              <span className="text-destructive">*</span>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50"
            >
              {posterPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={posterPreview}
                  alt="포스터 미리보기"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="size-8 text-primary/40" />
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              className="hidden"
              onChange={handlePosterChange}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              2 : 3 비율 · 1080 × 1620 권장
            </p>
          </div>

          {/* 폼 필드 */}
          <div className="flex flex-1 flex-col gap-5">
            {/* 행사 명 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="flex items-center gap-1">
                행사 명 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="행사명을 입력해주세요."
                required
                maxLength={20}
              />
            </div>

            {/* 시작일 / 종료일 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="startDate" className="flex items-center gap-1">
                  시작일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="endDate" className="flex items-center gap-1">
                  종료일 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* 주소 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location" className="flex items-center gap-1">
                주소 <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="행사 주소를 입력해주세요."
                  className="pl-8"
                  required
                  maxLength={100}
                />
              </div>
            </div>

            {/* 주소 지도 링크 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="locationUrl">주소 지도 링크</Label>
              <div className="relative">
                <Link2 className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="locationUrl"
                  name="locationUrl"
                  value={form.locationUrl}
                  onChange={handleChange}
                  placeholder="행사 지도 링크를 입력해주세요."
                  className="pl-8"
                  maxLength={100}
                />
              </div>
            </div>

            {/* 문의처 명 / 문의처 전화번호 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="production">문의처 명</Label>
                <Input
                  id="production"
                  name="production"
                  value={form.production}
                  onChange={handleChange}
                  placeholder="문의처 명을 입력해주세요."
                  maxLength={100}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contactPhone">문의처 전화번호</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    placeholder="000-0000-0000"
                    className="pl-8"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            {/* 문의처 이메일 / 운영시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contactEmail">문의처 이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={handleChange}
                    placeholder="문의처 이메일을 입력해주세요."
                    className="pl-8"
                    maxLength={254}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>운영시간</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleChange}
                  />
                  <span className="shrink-0 text-muted-foreground">~</span>
                  <Input
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* 비고 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="operatingRemarks">비고</Label>
              <Textarea
                id="operatingRemarks"
                name="operatingRemarks"
                value={form.operatingRemarks}
                onChange={handleChange}
                placeholder="운영상의 특이사항을 입력해주세요."
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
