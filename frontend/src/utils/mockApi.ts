// ============================================================
//  MOCK API  –  replaces axios / backend for DEMO mode
//  All mutations work in-memory (data resets on page refresh)
// ============================================================
import {
    DEMO_STUDENTS, DEMO_STAFF, DEMO_EXPENSES,
    buildDashboardStats, buildClasswiseReport, buildMonthlyReport,
    buildSalaryReport, buildPendingReport, DEMO_ATTENDANCE,
    DemoStudent, DemoStaff,
} from './demoData';

// ── helpers ──────────────────────────────────────────────────
let _seq = 90000;
const uid = () => `mock_${_seq++}`;
const delay = (ms = 120) => new Promise(r => setTimeout(r, ms));
const ok = (data: any) => ({ data });

// keep mutable references
let students = [...DEMO_STUDENTS];
let staff = [...DEMO_STAFF];
let expenses = [...DEMO_EXPENSES];

// ── Settings ─────────────────────────────────────────────────
const settingsData: any = {
    schoolName: 'St Aloysius High School',
    schoolAddress: 'Moula Ali, Hyderabad, Telangana',
    schoolPhone: '9848011234',
    schoolEmail: 'contact@staloysius.edu',
    principalName: 'Ramana Reddy',
    academicYear: '2025-26',
    feeReceiptPrefix: 'OXF',
    salarySlipPrefix: 'SAL',
    currency: '₹',
    receiptPrefix: 'OXF',
};

// ── Fee Structures (demo) ─────────────────────────────────────
const classFeeMap: Record<string, number> = {
    'Nursery': 8000, 'LKG': 8500, 'UKG': 9000, '1st': 10000, '2nd': 10000,
    '3rd': 11000, '4th': 11000, '5th': 12000, '6th': 13000, '7th': 13000,
    '8th': 14000, '9th': 15000, '10th': 16000
};
const classBookFeeMap: Record<string, number> = {
    'Nursery': 1500, 'LKG': 1800, 'UKG': 2000, '1st': 2200, '2nd': 2200,
    '3rd': 2500, '4th': 2500, '5th': 2800, '6th': 3000, '7th': 3000,
    '8th': 3200, '9th': 3500, '10th': 3500
};
let feeStructures: any[] = Object.entries(classFeeMap).map(([cls, fee]) => ({
    _id: `fs_${cls}`, class: cls, academicYear: '2025-26',
    tuitionFee: Math.round(fee * 0.7), admissionFee: Math.round(fee * 0.1),
    examFee: Math.round(fee * 0.05), libraryFee: Math.round(fee * 0.05),
    sportsFee: Math.round(fee * 0.05), transportFee: 0, miscFee: Math.round(fee * 0.05),
    totalFee: fee,
}));
let bookFeeStructures: any[] = Object.entries(classBookFeeMap).map(([cls, fee]) => ({
    _id: `bfs_${cls}`, class: cls, academicYear: '2025-26',
    textBooksFee: Math.round(fee * 0.6), noteBooksFee: Math.round(fee * 0.2),
    dairyFee: Math.round(fee * 0.05), idCardFee: 50, coversFee: Math.round(fee * 0.1),
    miscFee: 0, totalFee: fee,
}));

// ── Router ───────────────────────────────────────────────────
async function route(method: string, url: string, config: any = {}): Promise<any> {
    await delay();
    const params = config?.params || {};
    const payload = config?.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

    // ── Auth ──────────────────────────────────────────────────
    if (url === '/auth/me') return ok({ user: { _id: 'demo_admin', name: 'School Admin', email: 'demo@oxford.school', role: 'owner' } });
    if (url === '/auth/login') return ok({ token: 'demo_token', user: { _id: 'demo_admin', name: 'School Admin', email: 'demo@oxford.school', role: 'owner' } });

    // ── Auth extras ───────────────────────────────────────────
    if (url === '/auth/change-password') return ok({ message: 'Demo: Password change simulated' });

    // ── Settings ──────────────────────────────────────────────
    if (url === '/settings') {
        if (method === 'GET') return ok({ settings: settingsData });
        if (method === 'PUT') { Object.assign(settingsData, payload); return ok({ settings: settingsData }); }
    }
    if (url === '/settings/fee-structures') {
        if (method === 'GET') return ok({ structures: feeStructures });
        if (method === 'POST') {
            const idx = feeStructures.findIndex(f => f.class === payload.class);
            const entry = { _id: `fs_${payload.class}`, academicYear: '2025-26', totalFee: 0, ...payload };
            entry.totalFee = Object.entries(entry).filter(([k]) => k.endsWith('Fee') && k !== 'totalFee').reduce((s, [, v]) => s + Number(v || 0), 0);
            if (idx >= 0) feeStructures[idx] = entry; else feeStructures.push(entry);
            return ok({ message: 'Saved', structure: entry });
        }
    }
    if (url === '/settings/book-fee-structures') {
        if (method === 'GET') return ok({ structures: bookFeeStructures });
        if (method === 'POST') {
            const idx = bookFeeStructures.findIndex(f => f.class === payload.class);
            const entry = { _id: `bfs_${payload.class}`, academicYear: '2025-26', totalFee: 0, ...payload };
            entry.totalFee = Object.entries(entry).filter(([k]) => k.endsWith('Fee') && k !== 'totalFee').reduce((s, [, v]) => s + Number(v || 0), 0);
            if (idx >= 0) bookFeeStructures[idx] = entry; else bookFeeStructures.push(entry);
            return ok({ message: 'Saved', structure: entry });
        }
    }

    // ── Dashboard / Reports ───────────────────────────────────
    if (url === '/reports/dashboard') return ok({ dashboard: buildDashboardStats() });
    if (url === '/reports/classwise-fees') return ok({ report: buildClasswiseReport() });
    if (url === '/reports/monthly') return ok({ report: buildMonthlyReport() });
    if (url === '/reports/salary') return ok(buildSalaryReport());
    if (url === '/reports/pending-fees') return ok(buildPendingReport(params.class));

    // ── Students ──────────────────────────────────────────────
    if (url === '/students' && method === 'GET') {
        let list = [...students];
        if (params.academicYear) list = list.filter(s => s.academicYear === params.academicYear);
        if (params.class) list = list.filter(s => s.class === params.class);
        if (params.search) {
            const q = params.search.toLowerCase();
            list = list.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.studentId.toLowerCase().includes(q) ||
                s.rollNo.toLowerCase().includes(q) ||
                s.parentName.toLowerCase().includes(q)
            );
        }
        const total = list.length;
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 50;
        const paged = list.slice((page - 1) * limit, page * limit);
        return ok({ students: paged, total, pages: Math.ceil(total / limit), page });
    }

    if (url === '/students' && method === 'POST') {
        const id = uid();
        const seq = students.length + 1;
        const newStudent: any = {
            _id: id,
            studentId: `STD${String(seq).padStart(4, '0')}`,
            rollNo: payload.rollNo || `${payload.class?.substring(0, 3).toUpperCase()}${String(seq).padStart(2, '0')}`,
            totalPaid: 0, totalBookPaid: 0,
            pendingAmount: Number(payload.totalFee || 0) + Number(payload.totalBookFee || 0),
            paymentStatus: 'unpaid',
            isActive: true,
            payments: [], bookPayments: [],
            ...payload,
            totalFee: Number(payload.totalFee || 0),
            totalBookFee: Number(payload.totalBookFee || 0),
        };
        students.push(newStudent);
        return ok({ student: newStudent });
    }

    // single student GET
    const stuMatch = url.match(/^\/students\/([^/]+)$/);
    if (stuMatch && method === 'GET') {
        const s = students.find(x => x._id === stuMatch[1]);
        if (!s) throw { response: { data: { message: 'Student not found' }, status: 404 } };
        return ok({ student: s });
    }
    if (stuMatch && method === 'PUT') {
        const idx = students.findIndex(x => x._id === stuMatch[1]);
        if (idx === -1) throw { response: { data: { message: 'Not found' }, status: 404 } };
        students[idx] = { ...students[idx], ...payload };
        return ok({ student: students[idx] });
    }
    if (stuMatch && method === 'DELETE') {
        students = students.filter(x => x._id !== stuMatch[1]);
        return ok({ success: true });
    }

    // ── Student payments ──────────────────────────────────────
    const payMatch = url.match(/^\/students\/([^/]+)\/payments$/);
    if (payMatch) {
        const sIdx = students.findIndex(x => x._id === payMatch[1]);
        if (sIdx === -1) throw { response: { data: { message: 'Student not found' } } };
        if (method === 'GET') {
            return ok({
                student: students[sIdx],
                payments: students[sIdx].payments,
                totalPaid: students[sIdx].totalPaid,
                pendingAmount: students[sIdx].pendingAmount,
            });
        }
        if (method === 'POST') {
            const p = {
                _id: uid(),
                amount: Number(payload.amount),
                paymentDate: payload.paymentDate ? new Date(payload.paymentDate).toISOString() : new Date().toISOString(),
                paymentMode: payload.paymentMode || 'cash',
                feeType: payload.feeType || 'tuition',
                remarks: payload.remarks || '',
                receiptNo: `RCP${String(Date.now()).slice(-6)}`,
            };
            students[sIdx].payments.push(p);
            students[sIdx].totalPaid += p.amount;
            students[sIdx].pendingAmount = Math.max(0, students[sIdx].pendingAmount - p.amount);
            students[sIdx].paymentStatus = students[sIdx].pendingAmount === 0 ? 'paid' : 'partial';
            return ok({ payment: p, student: students[sIdx] });
        }
    }

    // edit / delete individual payment
    const singlePayMatch = url.match(/^\/students\/([^/]+)\/payments\/([^/]+)$/);
    if (singlePayMatch) {
        const sIdx = students.findIndex(x => x._id === singlePayMatch[1]);
        const pId = singlePayMatch[2];
        if (sIdx === -1) throw { response: { data: { message: 'Student not found' } } };
        if (method === 'PUT') {
            const pIdx = students[sIdx].payments.findIndex((p: any) => p._id === pId);
            if (pIdx === -1) throw { response: { data: { message: 'Payment not found' } } };
            const oldAmt = students[sIdx].payments[pIdx].amount;
            students[sIdx].payments[pIdx] = { ...students[sIdx].payments[pIdx], ...payload, amount: Number(payload.amount) };
            const diff = Number(payload.amount) - oldAmt;
            students[sIdx].totalPaid += diff;
            students[sIdx].pendingAmount = Math.max(0, students[sIdx].pendingAmount - diff);
            return ok({ success: true });
        }
        if (method === 'DELETE') {
            const pIdx = students[sIdx].payments.findIndex((p: any) => p._id === pId);
            if (pIdx !== -1) {
                const amt = students[sIdx].payments[pIdx].amount;
                students[sIdx].payments.splice(pIdx, 1);
                students[sIdx].totalPaid = Math.max(0, students[sIdx].totalPaid - amt);
                students[sIdx].pendingAmount += amt;
                students[sIdx].paymentStatus = students[sIdx].totalPaid === 0 ? 'unpaid' : 'partial';
            }
            return ok({ success: true });
        }
    }

    // ── Bulk student ops ──────────────────────────────────────
    if (url === '/students/bulk-delete' && method === 'POST') {
        const ids: string[] = payload.studentIds || [];
        students = students.filter(s => !ids.includes(s._id));
        return ok({ deleted: ids.length });
    }
    if (url === '/students/promote' && method === 'POST') {
        return ok({ promoted: 0, skipped: 0, message: 'Demo: Promotion simulated' });
    }
    if (url === '/students/import' && method === 'POST') {
        return ok({ imported: 0, message: 'Demo: Import simulated' });
    }

    // ── Staff ─────────────────────────────────────────────────
    if (url === '/staff' && method === 'GET') {
        let list = [...staff];
        if (params.role) list = list.filter(s => s.role === params.role);
        if (params.academicYear) list = list.filter(s => s.academicYear === params.academicYear);
        const total = list.length;
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 50;
        const paged = list.slice((page - 1) * limit, page * limit);
        return ok({ staff: paged, total, pages: Math.ceil(total / limit) });
    }
    if (url === '/staff' && method === 'POST') {
        const newStaff: any = {
            _id: uid(),
            staffId: `STF${200 + staff.length}`,
            totalSalaryPaid: 0,
            salaryPayments: [], leaves: [],
            isActive: true,
            ...payload,
            monthlySalary: Number(payload.monthlySalary || 0),
        };
        staff.push(newStaff);
        return ok({ staff: newStaff });
    }

    const staffMatch = url.match(/^\/staff\/([^/]+)$/);
    if (staffMatch && method === 'GET') {
        const s = staff.find(x => x._id === staffMatch[1]);
        return ok({ staff: s });
    }
    if (staffMatch && method === 'PUT') {
        const idx = staff.findIndex(x => x._id === staffMatch[1]);
        if (idx !== -1) staff[idx] = { ...staff[idx], ...payload, monthlySalary: Number(payload.monthlySalary || staff[idx].monthlySalary) };
        return ok({ staff: staff[idx] });
    }
    if (staffMatch && method === 'DELETE') {
        staff = staff.filter(x => x._id !== staffMatch[1]);
        return ok({ success: true });
    }

    // ── Staff Salaries ────────────────────────────────────────
    const salMatch = url.match(/^\/staff\/([^/]+)\/salaries$/);
    if (salMatch) {
        const sIdx = staff.findIndex(x => x._id === salMatch[1]);
        if (sIdx === -1) throw { response: { data: { message: 'Staff not found' } } };
        if (method === 'GET') {
            return ok({ staff: staff[sIdx], salaryPayments: staff[sIdx].salaryPayments });
        }
        if (method === 'POST') {
            const p = {
                _id: uid(),
                month: payload.month,
                amount: Number(payload.amount),
                baseAmount: Number(payload.baseAmount || payload.amount),
                cuttings: Number(payload.cuttings || 0),
                paymentDate: payload.paymentDate ? new Date(payload.paymentDate).toISOString() : new Date().toISOString(),
                paymentMode: payload.paymentMode || 'bank_transfer',
                remarks: payload.remarks || '',
            };
            staff[sIdx].salaryPayments.push(p);
            staff[sIdx].totalSalaryPaid += p.amount;
            return ok({ payment: p, staff: staff[sIdx] });
        }
    }

    const singleSalMatch = url.match(/^\/staff\/([^/]+)\/salaries\/([^/]+)$/);
    if (singleSalMatch) {
        const sIdx = staff.findIndex(x => x._id === singleSalMatch[1]);
        const pId = singleSalMatch[2];
        if (sIdx === -1) throw { response: { data: { message: 'Staff not found' } } };
        if (method === 'PUT') {
            const pIdx = staff[sIdx].salaryPayments.findIndex((p: any) => p._id === pId);
            if (pIdx !== -1) {
                const oldAmt = staff[sIdx].salaryPayments[pIdx].amount;
                staff[sIdx].salaryPayments[pIdx] = { ...staff[sIdx].salaryPayments[pIdx], ...payload, amount: Number(payload.amount) };
                staff[sIdx].totalSalaryPaid += Number(payload.amount) - oldAmt;
            }
            return ok({ success: true });
        }
        if (method === 'DELETE') {
            const pIdx = staff[sIdx].salaryPayments.findIndex((p: any) => p._id === pId);
            if (pIdx !== -1) {
                staff[sIdx].totalSalaryPaid -= staff[sIdx].salaryPayments[pIdx].amount;
                staff[sIdx].salaryPayments.splice(pIdx, 1);
            }
            return ok({ success: true });
        }
    }

    // ── Staff Leaves ──────────────────────────────────────────
    const leaveMatch = url.match(/^\/staff\/([^/]+)\/leaves$/);
    if (leaveMatch) {
        const sIdx = staff.findIndex(x => x._id === leaveMatch[1]);
        if (sIdx === -1) throw { response: { data: { message: 'Staff not found' } } };
        if (method === 'POST') {
            const leave = { _id: uid(), date: payload.date, reason: payload.reason || '', status: 'approved' };
            staff[sIdx].leaves.push(leave);
            return ok({ leave });
        }
    }

    const singleLeaveMatch = url.match(/^\/staff\/([^/]+)\/leaves\/([^/]+)$/);
    if (singleLeaveMatch) {
        const sIdx = staff.findIndex(x => x._id === singleLeaveMatch[1]);
        const lId = singleLeaveMatch[2];
        if (sIdx === -1) throw { response: { data: { message: 'Staff not found' } } };
        if (method === 'PUT') {
            const lIdx = staff[sIdx].leaves.findIndex((l: any) => l._id === lId);
            if (lIdx !== -1) staff[sIdx].leaves[lIdx] = { ...staff[sIdx].leaves[lIdx], ...payload };
            return ok({ success: true });
        }
        if (method === 'DELETE') {
            staff[sIdx].leaves = staff[sIdx].leaves.filter((l: any) => l._id !== lId);
            return ok({ success: true });
        }
    }

    // ── Expenses ──────────────────────────────────────────────
    if (url === '/expenses' && method === 'GET') return ok({ expenses });
    if (url === '/expenses' && method === 'POST') {
        const exp = { _id: uid(), ...payload, amount: Number(payload.amount) };
        expenses.push(exp as any);
        return ok({ expense: exp });
    }
    const expMatch = url.match(/^\/expenses\/([^/]+)$/);
    if (expMatch && method === 'PUT') {
        const idx = expenses.findIndex(x => x._id === expMatch[1]);
        if (idx !== -1) expenses[idx] = { ...expenses[idx], ...payload, amount: Number(payload.amount) };
        return ok({ expense: expenses[idx] });
    }
    if (expMatch && method === 'DELETE') {
        expenses = expenses.filter(x => x._id !== expMatch[1]);
        return ok({ success: true });
    }

    // ── Attendance ────────────────────────────────────────────
    if (url.startsWith('/attendance')) {
        const dateMatch = url.match(/^\/attendance\/(\d{4}-\d{2}-\d{2})$/);
        if (method === 'GET' && dateMatch) {
            const date = dateMatch[1];
            const records = DEMO_ATTENDANCE[date] || null;
            if (!records) return ok({ success: false });
            return ok({ success: true, attendance: { date, records } });
        }
        if (method === 'POST') {
            const { date, records } = payload;
            DEMO_ATTENDANCE[date] = records;
            return ok({ success: true });
        }
    }

    // ── Admin / Users (stub) ──────────────────────────────────
    if (url.startsWith('/admin') || url.startsWith('/users')) {
        return ok({ users: [], total: 0, message: 'Demo mode – admin panel disabled' });
    }

    // fallback – should not reach here
    console.warn('[MOCK API] Unhandled:', method, url);
    return ok({});
}

// ── Drop-in axios-like API object ─────────────────────────────
const API = {
    get: (url: string, config?: any) => route('GET', url, config),
    post: (url: string, data?: any, config?: any) => route('POST', url, { ...config, data }),
    put: (url: string, data?: any, config?: any) => route('PUT', url, { ...config, data }),
    delete: (url: string, config?: any) => route('DELETE', url, config),
    interceptors: {
        request: { use: () => { } },
        response: { use: () => { } },
    },
    create: () => API,
    defaults: { headers: { common: {} } },
};

export default API;
