import type {
  Announcement,
  Article,
  ArticleCategory,
  Branch,
  CampusBuilding,
  CheckupPackage,
  Department,
  DepartmentGroup,
  Doctor,
  DoctorFilter,
  DoctorSchedule,
  Faq,
  Hospital,
  Page,
  InsuranceProvider,
  Slot,
  SlotQuery,
  Technology,
} from "./types";

export interface HospitalRepo {
  get(): Promise<Hospital>;
}

export interface BranchRepo {
  list(): Promise<Branch[]>;
  getBySlug(slug: string): Promise<Branch | undefined>;
  getById(id: string): Promise<Branch | undefined>;
}

export interface DepartmentRepo {
  list(): Promise<Department[]>;
  groups(): Promise<DepartmentGroup[]>;
  getBySlug(slug: string): Promise<Department | undefined>;
  getById(id: string): Promise<Department | undefined>;
  featured(): Promise<Department[]>;
  /** Online randevu alınabilen birimler (klinik + check-up). */
  bookable(): Promise<Department[]>;
}

export interface DoctorRepo {
  list(filter?: DoctorFilter): Promise<Doctor[]>;
  getBySlug(slug: string): Promise<Doctor | undefined>;
  getById(id: string): Promise<Doctor | undefined>;
  featured(): Promise<Doctor[]>;
  byDepartment(departmentId: string): Promise<Doctor[]>;
  schedules(doctorId: string): Promise<DoctorSchedule[]>;
  /** Doktorun programından türetilen şubeler. */
  branchIds(doctorId: string): Promise<string[]>;
}

export interface TechnologyRepo {
  byIds(ids: string[]): Promise<Technology[]>;
  list(): Promise<Technology[]>;
}

export interface ArticleRepo {
  list(opts?: {
    departmentId?: string;
    categoryId?: string;
    authorDoctorId?: string;
    limit?: number;
  }): Promise<Article[]>;
  getBySlug(slug: string): Promise<Article | undefined>;
  categories(): Promise<ArticleCategory[]>;
}

export interface AnnouncementRepo {
  list(limit?: number): Promise<Announcement[]>;
  getBySlug(slug: string): Promise<Announcement | undefined>;
}

export interface CampusRepo {
  /** Merkez Kampüs binaları (3D maket ve bina listesi). */
  buildings(): Promise<CampusBuilding[]>;
}

export interface PageRepo {
  list(section?: Page["section"]): Promise<Page[]>;
  getByPath(path: string): Promise<Page | undefined>;
}

export interface FaqRepo {
  list(opts: { scope: Faq["scope"]; departmentId?: string }): Promise<Faq[]>;
}

export interface InsuranceRepo {
  list(): Promise<InsuranceProvider[]>;
}

export interface CheckupRepo {
  list(): Promise<CheckupPackage[]>;
}

export interface AppointmentService {
  getSlots(query: SlotQuery): Promise<Slot[]>;
  /** Slotun hâlâ uygun olup olmadığını sunucu tarafında yeniden doğrular. */
  isSlotAvailable(
    slot: Pick<Slot, "doctorId" | "branchId" | "departmentId" | "startsAt">,
    now: Date,
  ): Promise<boolean>;
}

export interface DataSource {
  hospital: HospitalRepo;
  pages: PageRepo;
  campus: CampusRepo;
  branches: BranchRepo;
  departments: DepartmentRepo;
  doctors: DoctorRepo;
  technologies: TechnologyRepo;
  articles: ArticleRepo;
  announcements: AnnouncementRepo;
  faqs: FaqRepo;
  insurance: InsuranceRepo;
  checkups: CheckupRepo;
  appointments: AppointmentService;
}
