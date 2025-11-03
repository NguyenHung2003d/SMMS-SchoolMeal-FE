"use client";

import React, { useMemo, useRef, useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  UserPlus,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { classes, parents, students } from "@/data";
import type { ClassItem, Student } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const initialTab = (searchParams.get("tab") || "list") as "list" | "excel";
  const [tab, setTab] = useState<"list" | "excel">(initialTab);

  useEffect(() => {
    const sp = searchParams.get("tab");
    if (sp === "list" || sp === "excel") setTab(sp);
  }, [searchParams]);

  const { classId } = use(params);
  const idNum = Number(classId);
  const currentClass: ClassItem | undefined = useMemo(
    () => classes.find((c: ClassItem) => c.id === idNum),
    [idNum]
  );

  // Nếu Student đang lưu theo tên lớp (vd: student.class = "3A")
  const className = currentClass?.name ?? "";

  const classStudents: Student[] = useMemo(
    () => students.filter((s: Student) => s.class === className),
    [className]
  );

  const parentsWithoutAccounts = useMemo(
    () => classStudents.filter((s) => !s.parent?.hasAccount).length,
    [classStudents]
  );

  // Điều hướng khi đổi tab để giữ ?tab=... trên URL
  const onTabChange = (value: string) => {
    const next = value === "excel" ? "excel" : "list";
    setTab(next);
    router.replace(`/manager/parents/class/${idNum}?tab=${next}`);
  };

  if (!currentClass) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="outline" asChild>
          <Link href="/manager/parents">
            <ArrowLeft size={16} className="mr-2" />
            Quay lại trang quản lý
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              Không tìm thấy lớp với id = {idNum}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Vui lòng kiểm tra lại đường dẫn hoặc danh sách lớp.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb + Header */}
      <div className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href="/manager/parents" className="hover:underline">
            Manager / Phụ huynh
          </Link>{" "}
          / <span className="text-gray-700">Lớp {currentClass.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Lớp {currentClass.name}
            </h1>
            <p className="text-gray-600">
              Tổng số học sinh: <b>{classStudents.length}</b> · Phụ huynh chưa
              có tài khoản:{" "}
              <b className={parentsWithoutAccounts > 0 ? "text-red-600" : ""}>
                {parentsWithoutAccounts}
              </b>
            </p>
          </div>
        </div>
        <div className="bg-white p-4 border rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cảnh báo nếu còn phụ huynh chưa có account */}
      {parentsWithoutAccounts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <AlertCircle size={18} className="text-red-600 mr-2 mt-0.5" />
          <p className="text-sm text-red-700">
            Có {parentsWithoutAccounts} phụ huynh chưa có tài khoản. Bạn có thể
            tạo tài khoản ở tab <b>“Danh sách phụ huynh”</b> theo từng người,
            hoặc nhập file ở tab <b>“Nhập Excel”</b>.
          </p>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="list">Danh sách phụ huynh</TabsTrigger>
          <TabsTrigger value="excel">Nhập Excel</TabsTrigger>
        </TabsList>

        {/* Tab: Danh sách phụ huynh */}
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách học sinh & phụ huynh</CardTitle>
            </CardHeader>
            <CardContent>
              {classStudents.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Chưa có học sinh trong lớp này.
                </p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {classStudents.map((stu) => (
                    <StudentRow key={stu.id} stu={stu} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Nhập Excel */}
        <TabsContent value="excel" className="mt-4">
          <ExcelUploadSection className={currentClass.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* -----------------------
 * Sub Components
 * ---------------------*/

function StudentRow({ stu }: { stu: Student }) {
  const has = !!stu.parent?.hasAccount;

  const createOneAccount = () => {
    // TODO: call API tạo account cho stu.parent
    alert(`Tạo tài khoản phụ huynh cho: ${stu.parent.name} (HS: ${stu.name})`);
  };

  return (
    <div
      className={`flex items-start justify-between p-4 ${
        has ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div>
        <p className="font-semibold text-gray-800">{stu.name}</p>
        <p className="text-sm text-gray-600">{stu.gender}</p>
      </div>
      <div className="text-right text-sm text-gray-700">
        <p>{stu.parent.name}</p>
        <p>{stu.parent.email}</p>
        <p>{stu.parent.phone}</p>
        {!has && (
          <Button
            size="sm"
            variant="secondary"
            className="mt-2"
            onClick={createOneAccount}
          >
            <UserPlus size={14} className="mr-1" />
            Tạo tài khoản
          </Button>
        )}
      </div>
    </div>
  );
}

function ExcelUploadSection({ className }: { className: string }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onPick = () => fileRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const onUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      // TODO: parse & gửi file tới API backend (SheetJS/xlsx hoặc upload server)
      await new Promise((r) => setTimeout(r, 800));
      alert(`Đã tải file: ${file.name} cho lớp ${className}. (Demo)`);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập Excel cho lớp {className}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Tải lên tệp <b>.xlsx / .xls / .csv</b> để tạo tài khoản phụ huynh hàng
          loạt cho lớp này.
        </div>
        <div className="flex items-center gap-2">
          <Input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onChange}
            className="hidden"
          />
          <Button variant="outline" onClick={onPick}>
            <Upload size={16} className="mr-2" />
            Chọn tệp Excel
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <div className="text-sm text-gray-600">
            {file ? (
              <span>Đã chọn: {file.name}</span>
            ) : (
              <span>Chưa chọn tệp</span>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onUpload} disabled={!file || uploading}>
            {uploading ? "Đang tải..." : "Tải lên & xử lý"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
