//  DEMO DATA  –  St Aloysius High School
//  All API calls will be served from this in-memory store
// ============================================================

export const getCurrentAY = () => '2025-26';

// ─── helpers ────────────────────────────────────────────────
let _idCounter = 1000;
const uid = () => `demo_${_idCounter++}`;

const months = [
    'September 2025', 'October 2025', 'November 2025',
    'December 2025', 'January 2026', 'February 2026',
];
const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T>(arr: T[]) => arr[rnd(0, arr.length - 1)];

// ─── Staff ──────────────────────────────────────────────────
export interface DemoStaff {
    _id: string; staffId: string; name: string; phone: string;
    role: string; subject?: string; department?: string;
    qualification?: string; experience?: string; gender: string;
    address?: string; monthlySalary: number; joiningDate: string;
    bankAccount?: string; bankName?: string; ifscCode?: string;
    academicYear: string; isActive: boolean;
    totalSalaryPaid: number;
    salaryPayments: any[]; leaves: any[];
}

const staffRaw = [
    { name: 'Ramana Reddy', role: 'principal', subject: '', gender: 'male', salary: 28000, phone: '9848011234', qual: 'M.Ed', exp: '15 Years' },
    { name: 'Lakshmi Devi', role: 'vice_principal', subject: '', gender: 'female', salary: 22000, phone: '9848022345', qual: 'M.Ed', exp: '12 Years' },
    { name: 'Srinivas Rao', role: 'teacher', subject: 'Mathematics', gender: 'male', salary: 16000, phone: '9848033456', qual: 'B.Ed, M.Sc', exp: '8 Years' },
    { name: 'Padmaja Sharma', role: 'teacher', subject: 'Science', gender: 'female', salary: 16000, phone: '9848044567', qual: 'B.Ed, M.Sc', exp: '7 Years' },
    { name: 'Venkata Rao', role: 'teacher', subject: 'Telugu', gender: 'male', salary: 14000, phone: '9848055678', qual: 'B.Ed', exp: '10 Years' },
    { name: 'Sunitha Kumari', role: 'teacher', subject: 'English', gender: 'female', salary: 15000, phone: '9848066789', qual: 'B.Ed, M.A', exp: '6 Years' },
    { name: 'Narayana Prasad', role: 'teacher', subject: 'Social Studies', gender: 'male', salary: 14000, phone: '9848077890', qual: 'B.Ed', exp: '9 Years' },
    { name: 'Bhavani Reddy', role: 'teacher', subject: 'Hindi', gender: 'female', salary: 13000, phone: '9848088901', qual: 'B.Ed', exp: '5 Years' },
    { name: 'Kiran Kumar', role: 'teacher', subject: 'Physical Education', gender: 'male', salary: 12000, phone: '9848099012', qual: 'B.P.Ed', exp: '4 Years' },
    { name: 'Meenakshi Rao', role: 'librarian', subject: '', gender: 'female', salary: 11000, phone: '9848010123', qual: 'B.L.I.Sc', exp: '6 Years' },
    { name: 'Rajesh Goud', role: 'accountant', subject: '', gender: 'male', salary: 14000, phone: '9848021234', qual: 'B.Com', exp: '5 Years' },
    { name: 'Sarada Devi', role: 'admin_staff', subject: '', gender: 'female', salary: 10000, phone: '9848032345', qual: 'Intermediate', exp: '3 Years' },
    { name: 'Suresh Babu', role: 'peon', subject: '', gender: 'male', salary: 8000, phone: '9848043456', qual: '10th Pass', exp: '7 Years' },
    { name: 'Ramu Naidu', role: 'guard', subject: '', gender: 'male', salary: 9000, phone: '9848054567', qual: '10th Pass', exp: '5 Years' },
    { name: 'Anitha Varma', role: 'teacher', subject: 'Computer Science', gender: 'female', salary: 16000, phone: '9848065678', qual: 'B.Tech, B.Ed', exp: '4 Years' },
];

let staffIdSeq = 101;
export const DEMO_STAFF: DemoStaff[] = staffRaw.map(s => {
    const _id = uid();
    const staffId = `STF${staffIdSeq++}`;

    // generate salary payments for last 5 months
    const salaryPayments = months.slice(0, 5).map((month, i) => ({
        _id: uid(),
        month,
        amount: s.salary - (i === 2 ? 500 : 0),
        baseAmount: s.salary,
        cuttings: i === 2 ? 500 : 0,
        paymentDate: new Date(2025, 8 + i, 5).toISOString(),
        paymentMode: 'bank_transfer',
        remarks: i === 2 ? 'Half-day deduction' : '',
    }));

    // 1-2 leaves
    const leaves = [
        { _id: uid(), date: '2025-11-12', reason: 'Sick leave', status: 'approved' },
    ];

    return {
        _id, staffId,
        name: s.name, phone: s.phone, role: s.role,
        subject: s.subject, department: 'Academic',
        qualification: s.qual, experience: s.exp, gender: s.gender,
        address: 'Moula Ali, Hyderabad, Telangana',
        monthlySalary: s.salary,
        joiningDate: '2020-06-01T00:00:00.000Z',
        bankAccount: '1234567890', bankName: 'SBI', ifscCode: 'SBIN0001234',
        academicYear: '2025-26',
        isActive: true,
        totalSalaryPaid: salaryPayments.reduce((a, p) => a + p.amount, 0),
        salaryPayments,
        leaves,
    };
});

// ─── Students ────────────────────────────────────────────────
export interface DemoStudent {
    _id: string; studentId: string; name: string; class: string;
    rollNo: string; gender: string; parentName: string;
    parentPhone: string; parentEmail: string; dateOfBirth: string;
    address: string; totalFee: number; totalBookFee: number;
    totalPaid: number; totalBookPaid: number;
    pendingAmount: number; paymentStatus: string;
    academicYear: string; isActive: boolean;
    payments: any[]; bookPayments: any[];
}

const classData = [
    { cls: 'Nursery', count: 22, fee: 8000, book: 1500 },
    { cls: 'LKG', count: 24, fee: 8500, book: 1800 },
    { cls: 'UKG', count: 24, fee: 9000, book: 2000 },
    { cls: '1st', count: 30, fee: 10000, book: 2200 },
    { cls: '2nd', count: 28, fee: 10000, book: 2200 },
    { cls: '3rd', count: 30, fee: 11000, book: 2500 },
    { cls: '4th', count: 28, fee: 11000, book: 2500 },
    { cls: '5th', count: 26, fee: 12000, book: 2800 },
    { cls: '6th', count: 30, fee: 13000, book: 3000 },
    { cls: '7th', count: 28, fee: 13000, book: 3000 },
    { cls: '8th', count: 25, fee: 14000, book: 3200 },
    { cls: '9th', count: 26, fee: 15000, book: 3500 },
    { cls: '10th', count: 24, fee: 16000, book: 3500 },
];

const boyNames = [
    'Aarav Reddy', 'Arjun Sharma', 'Vikram Rao', 'Rahul Kumar', 'Sai Teja', 'Karthik Naidu',
    'Pranav Goud', 'Nikhil Varma', 'Rishi Yadav', 'Akash Singh', 'Dhruv Pillai', 'Vivek Babu',
    'Suresh Rao', 'Ganesh Kumar', 'Harish Reddy', 'Lokesh Varma', 'Aditya Gupta', 'Rohan Patel',
    'Tarun Reddy', 'Manish Kumar', 'Pavan Rao', 'Charan Goud', 'Manoj Babu', 'Naveen Singh',
    'Satish Rao', 'Kishore Reddy', 'Surya Naidu', 'Ajay Kumar', 'Praveen Varma', 'Hemanth Rao',
];
const girlNames = [
    'Anjali Reddy', 'Priya Sharma', 'Sowmya Rao', 'Divya Kumar', 'Bhavana Goud', 'Sravani Naidu',
    'Lavanya Varma', 'Tejaswini Rao', 'Madhavi Pillai', 'Sushma Reddy', 'Kavitha Singh', 'Nandini Babu',
    'Meghana Rao', 'Pooja Reddy', 'Sahithi Kumar', 'Ramya Goud', 'Sirisha Naidu', 'Deepthi Varma',
    'Haritha Rao', 'Mounika Singh', 'Neha Reddy', 'Pushpa Kumar', 'Chandana Babu', 'Revathi Rao',
    'Swetha Naidu', 'Keerthi Goud', 'Anusha Reddy', 'Deepika Kumar', 'Jyothi Varma', 'Anitha Rao',
];

const parentNames = [
    'Suresh Reddy', 'Ravi Sharma', 'Venkat Rao', 'Prakash Kumar', 'Srinath Goud',
    'Naresh Naidu', 'Ramesh Varma', 'Santosh Singh', 'Kishore Babu', 'Vinod Rao',
    'Anil Reddy', 'Bhaskar Sharma', 'Chandra Rao', 'Devender Kumar', 'Eswar Goud',
];

let studentIdSeq = 1;
let rollSeqMap: Record<string, number> = {};

export const DEMO_STUDENTS: DemoStudent[] = [];

classData.forEach(({ cls, count, fee, book }) => {
    rollSeqMap[cls] = 1;
    for (let i = 0; i < count; i++) {
        const isGirl = i % 3 === 2; // roughly 1/3 girls
        const nameArr = isGirl ? girlNames : boyNames;
        const name = nameArr[(i + classData.findIndex(c => c.cls === cls) * 3) % nameArr.length];
        const _id = uid();
        const studentId = `STD${String(studentIdSeq++).padStart(4, '0')}`;
        const rollNo = `${cls.substring(0, 3).toUpperCase()}${String(rollSeqMap[cls]++).padStart(2, '0')}`;
        const parentName = parentNames[i % parentNames.length];
        const parentPhone = `98480${String(10000 + studentIdSeq).slice(1)}`;

        // fee paid status varies
        const paidPercent = pick([1, 1, 1, 0.75, 0.5, 0]);
        const totalPaid = Math.round(fee * paidPercent / 100) * 100;
        const totalBookPaid = paidPercent >= 1 ? book : 0;

        // generate payment records
        const payments: any[] = [];
        if (totalPaid > 0) {
            const installments = paidPercent === 1 ? [fee * 0.5, fee * 0.5] : [totalPaid];
            let runningDate = new Date('2025-06-10');
            installments.forEach(amt => {
                payments.push({
                    _id: uid(),
                    amount: amt,
                    paymentDate: new Date(runningDate).toISOString(),
                    paymentMode: pick(['cash', 'online', 'cash', 'cash']),
                    feeType: 'tuition',
                    receiptNo: `RCP${String(rnd(1000, 9999))}`,
                    remarks: '',
                });
                runningDate.setMonth(runningDate.getMonth() + 3);
            });
        }

        const pending = (fee + book) - totalPaid - totalBookPaid;
        const paymentStatus = pending === 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'unpaid';

        DEMO_STUDENTS.push({
            _id, studentId, name,
            class: cls, rollNo,
            gender: isGirl ? 'female' : 'male',
            parentName, parentPhone,
            parentEmail: `parent${studentIdSeq}@gmail.com`,
            dateOfBirth: `200${rnd(4, 9)}-${String(rnd(1, 12)).padStart(2, '0')}-${String(rnd(1, 28)).padStart(2, '0')}`,
            address: 'Moula Ali, Hyderabad, Telangana',
            totalFee: fee, totalBookFee: book,
            totalPaid, totalBookPaid,
            pendingAmount: pending > 0 ? pending : 0,
            paymentStatus,
            academicYear: '2025-26',
            isActive: true,
            payments,
            bookPayments: totalBookPaid > 0 ? [{
                _id: uid(),
                amount: book,
                paymentDate: new Date('2025-06-15').toISOString(),
                paymentMode: 'cash',
                feeType: 'book',
                receiptNo: `BRP${rnd(100, 999)}`,
                remarks: '',
            }] : [],
        });
    }
});

// ─── Expenses ────────────────────────────────────────────────
export const DEMO_EXPENSES = [
    { _id: uid(), type: 'electricity_bill', amount: 4800, description: 'October 2025 EB Bill', date: '2025-10-05', paymentMode: 'online', paidBy: 'Rajesh Goud', academicYear: '2025-26' },
    { _id: uid(), type: 'electricity_bill', amount: 5200, description: 'November 2025 EB Bill', date: '2025-11-04', paymentMode: 'online', paidBy: 'Rajesh Goud', academicYear: '2025-26' },
    { _id: uid(), type: 'electricity_bill', amount: 4600, description: 'December 2025 EB Bill', date: '2025-12-03', paymentMode: 'online', paidBy: 'Rajesh Goud', academicYear: '2025-26' },
    { _id: uid(), type: 'electricity_bill', amount: 5500, description: 'January 2026 EB Bill', date: '2026-01-06', paymentMode: 'online', paidBy: 'Rajesh Goud', academicYear: '2025-26' },
    { _id: uid(), type: 'electricity_bill', amount: 5100, description: 'February 2026 EB Bill', date: '2026-02-05', paymentMode: 'online', paidBy: 'Rajesh Goud', academicYear: '2025-26' },
    { _id: uid(), type: 'land_lease', amount: 25000, description: 'Q1 Land Lease (Sep-Nov 2025)', date: '2025-09-01', paymentMode: 'cheque', paidBy: 'Ramana Reddy', academicYear: '2025-26' },
    { _id: uid(), type: 'land_lease', amount: 25000, description: 'Q2 Land Lease (Dec-Feb 2026)', date: '2025-12-01', paymentMode: 'cheque', paidBy: 'Ramana Reddy', academicYear: '2025-26' },
    { _id: uid(), type: 'van_fan_fee', amount: 3500, description: 'Van maintenance October', date: '2025-10-10', paymentMode: 'cash', paidBy: 'Suresh Babu', academicYear: '2025-26' },
    { _id: uid(), type: 'van_fan_fee', amount: 3500, description: 'Van maintenance November', date: '2025-11-10', paymentMode: 'cash', paidBy: 'Suresh Babu', academicYear: '2025-26' },
    { _id: uid(), type: 'van_daily_diesel', amount: 1200, description: 'Diesel Oct W1', date: '2025-10-07', paymentMode: 'cash', paidBy: 'Ramu Naidu', academicYear: '2025-26' },
    { _id: uid(), type: 'van_daily_diesel', amount: 1150, description: 'Diesel Oct W2', date: '2025-10-14', paymentMode: 'cash', paidBy: 'Ramu Naidu', academicYear: '2025-26' },
    { _id: uid(), type: 'van_daily_diesel', amount: 1300, description: 'Diesel Nov W1', date: '2025-11-07', paymentMode: 'cash', paidBy: 'Ramu Naidu', academicYear: '2025-26' },
];

// ─── Dashboard Stats (derived) ────────────────────────────────
export function buildDashboardStats() {
    const totalStudents = DEMO_STUDENTS.length;
    const totalStaff = DEMO_STAFF.length;
    const totalFeesCollected = DEMO_STUDENTS.reduce((s, st) => s + st.totalPaid, 0);
    const totalFeesPending = DEMO_STUDENTS.reduce((s, st) => s + st.pendingAmount, 0);
    const totalSalaryPaid = DEMO_STAFF.reduce((s, st) => s + st.totalSalaryPaid, 0);
    const libraryCollected = DEMO_STUDENTS.reduce((s, st) => s + st.totalBookPaid, 0);
    const libraryPending = DEMO_STUDENTS.reduce((s, st) => s + (st.totalBookFee - st.totalBookPaid), 0);
    const studentsFullyPaid = DEMO_STUDENTS.filter(s => s.paymentStatus === 'paid').length;
    const collectionRate = Math.round((totalFeesCollected / (totalFeesCollected + totalFeesPending)) * 100);

    // Class-wise
    const classWise: Record<string, any> = {};
    DEMO_STUDENTS.forEach(s => {
        if (!classWise[s.class]) classWise[s.class] = { collected: 0, pending: 0, count: 0 };
        classWise[s.class].collected += s.totalPaid;
        classWise[s.class].pending += s.pendingAmount;
        classWise[s.class].count += 1;
    });

    // Monthly collections (simulated)
    const monthlyCollections: Record<string, number> = {};
    const monthlySalaryPaid: Record<string, number> = {};
    const shortMonths = ['Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26'];
    [62000, 145000, 130000, 118000, 152000, 98000].forEach((v, i) => { monthlyCollections[shortMonths[i]] = v; });
    [140000, 185000, 182000, 186000, 187000, 188000].forEach((v, i) => { monthlySalaryPaid[shortMonths[i]] = v; });

    // Recent payments (from students)
    const recentPayments: any[] = [];
    DEMO_STUDENTS.forEach(s => {
        s.payments.forEach(p => {
            recentPayments.push({
                receiptNo: p.receiptNo,
                studentName: s.name,
                class: s.class,
                amount: p.amount,
                paymentMode: p.paymentMode,
                paymentDate: p.paymentDate,
            });
        });
    });
    recentPayments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

    return {
        totalStudents, totalStaff,
        totalFeesCollected, totalFeesPending,
        totalSalaryPaid, libraryCollected, libraryPending,
        studentsFullyPaid, collectionRate,
        classWise, monthlyCollections, monthlySalaryPaid,
        recentPayments: recentPayments.slice(0, 15),
    };
}

// ─── Reports helpers ──────────────────────────────────────────
export function buildClasswiseReport() {
    const classes = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
    return classes.map(cls => {
        const students = DEMO_STUDENTS.filter(s => s.class === cls);
        const totalFee = students.reduce((a, s) => a + s.totalFee, 0);
        const totalCollected = students.reduce((a, s) => a + s.totalPaid, 0);
        const totalPending = students.reduce((a, s) => a + s.pendingAmount, 0);
        return {
            class: cls,
            totalStudents: students.length,
            totalFee, totalCollected, totalPending,
            paidCount: students.filter(s => s.paymentStatus === 'paid').length,
            partialCount: students.filter(s => s.paymentStatus === 'partial').length,
            unpaidCount: students.filter(s => s.paymentStatus === 'unpaid').length,
        };
    });
}

export function buildMonthlyReport() {
    const monthLabels = ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'];
    const incomes = [62000, 145000, 130000, 118000, 152000, 98000];
    const expenses = [182000, 185000, 182000, 186000, 187000, 188000];
    return monthLabels.map((month, i) => ({
        month,
        income: incomes[i],
        expense: expenses[i],
        net: incomes[i] - expenses[i],
    }));
}

export function buildSalaryReport() {
    const totalMonthlySalary = DEMO_STAFF.reduce((a, s) => a + s.monthlySalary, 0);
    const totalPaid = DEMO_STAFF.reduce((a, s) => a + s.totalSalaryPaid, 0);
    return {
        totalMonthlySalary, totalPaid,
        staff: DEMO_STAFF.map(s => ({
            _id: s._id, staffId: s.staffId, name: s.name,
            role: s.role, qualification: s.qualification,
            monthlySalary: s.monthlySalary,
            totalSalaryPaid: s.totalSalaryPaid,
            payments: s.salaryPayments,
        })),
    };
}

export function buildPendingReport(classFilter?: string) {
    let students = DEMO_STUDENTS.filter(s => s.pendingAmount > 0);
    if (classFilter) students = students.filter(s => s.class === classFilter);
    const totalPending = students.reduce((a, s) => a + s.pendingAmount, 0);
    return {
        totalPending,
        count: students.length,
        pendingStudents: students.map(s => ({
            _id: s._id, studentId: s.studentId, name: s.name,
            class: s.class, rollNo: s.rollNo,
            parentPhone: s.parentPhone,
            totalFee: s.totalFee, totalPaid: s.totalPaid,
            pendingAmount: s.pendingAmount,
            paymentStatus: s.paymentStatus,
            academicYear: s.academicYear,
        })),
    };
}

// Attendance demo data
export const DEMO_ATTENDANCE: Record<string, any[]> = {
    [new Date().toISOString().split('T')[0]]: [], // today - empty so mark mode works
};
