// =====================================================
// store.js — localStorage-based data store for Amar Jela
// =====================================================

const KEYS = {
    USERS: 'amjela_users',
    CURRENT_USER: 'amjela_current_user',
    CATEGORIES: 'amjela_categories',
    CONTENT: 'amjela_content',
    NOTIFICATIONS: 'amjela_notifications',
    ADMIN: 'amjela_admin',
    NOTICES: 'amjela_notices',
};

// ── Initialization ──────────────────────────────────
function initStore() {
    // Seed categories if not set
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
        localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    // Seed admin credentials
    if (!localStorage.getItem(KEYS.ADMIN)) {
        localStorage.setItem(KEYS.ADMIN, JSON.stringify({ username: 'admin', password: 'admin123' }));
    }
    // Seed notices
    if (!localStorage.getItem(KEYS.NOTICES)) {
        localStorage.setItem(KEYS.NOTICES, JSON.stringify([
            "আমার জেলা অ্যাপে আপনাকে স্বাগতম! আপনার জেলার তথ্য যোগ করুন এবং অন্যদের সাহায্য করুন।"
        ]));
    }
}

// ── Auth ────────────────────────────────────────────
function getUsers() {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
}

function saveUser(user) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

function getUserByPhone(phone) {
    return getUsers().find(u => u.phone === phone);
}

function getUserByEmail(email) {
    return getUsers().find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
}

function getCurrentUser() {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem(KEYS.CURRENT_USER);
}

function registerUser(data) {
    // Validate unique phone
    if (getUserByPhone(data.phone)) {
        return { success: false, error: 'এই ফোন নম্বর দিয়ে ইতোমধ্যে রেজিষ্ট্রেশন হয়েছে।' };
    }
    const user = {
        id: 'u_' + Date.now(),
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        password: data.password,
        divisionId: data.divisionId,
        districtId: data.districtId,
        thana: data.thana || '',
        village: data.village || '',
        selectedDivisionId: data.divisionId,
        selectedDistrictId: data.districtId,
        createdAt: new Date().toISOString(),
        role: 'user'
    };
    saveUser(user);
    setCurrentUser(user);
    return { success: true, user };
}

function loginUser(identifier, password) {
    let user = getUserByPhone(identifier) || getUserByEmail(identifier);
    if (!user) return { success: false, error: 'ব্যবহারকারী পাওয়া যায়নি।' };
    if (user.password !== password) return { success: false, error: 'পাসওয়ার্ড সঠিক নয়।' };
    setCurrentUser(user);
    return { success: true, user };
}

function updateCurrentUser(updates) {
    const user = getCurrentUser();
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);
    setCurrentUser(updated);
    return updated;
}

// ── Categories ──────────────────────────────────────
function getCategories() {
    return JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || '[]');
}

function saveCategory(cat) {
    const cats = getCategories();
    const idx = cats.findIndex(c => c.id === cat.id);
    if (idx >= 0) cats[idx] = cat;
    else cats.push(cat);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
}

function deleteCategory(catId) {
    const cats = getCategories().filter(c => c.id !== catId);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
}

// ── Content ─────────────────────────────────────────
function getContent(filters = {}) {
    let items = JSON.parse(localStorage.getItem(KEYS.CONTENT) || '[]');
    if (filters.districtId) items = items.filter(i => i.districtId === filters.districtId);
    if (filters.categoryId) items = items.filter(i => i.categoryId === filters.categoryId);
    if (filters.status) items = items.filter(i => i.status === filters.status);
    if (filters.divisionId) items = items.filter(i => i.divisionId === filters.divisionId);
    return items;
}

function saveContent(item) {
    const items = JSON.parse(localStorage.getItem(KEYS.CONTENT) || '[]');
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.push(item);
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(items));
}

function deleteContent(itemId) {
    const items = JSON.parse(localStorage.getItem(KEYS.CONTENT) || '[]').filter(i => i.id !== itemId);
    localStorage.setItem(KEYS.CONTENT, JSON.stringify(items));
}

function submitContent(data) {
    const user = getCurrentUser();
    const item = {
        id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        categoryId: data.categoryId,
        districtId: data.districtId,
        divisionId: data.divisionId,
        title: data.title,
        phone: data.phone || '',
        address: data.address || '',
        description: data.description || '',
        extra: data.extra || {},
        submittedBy: user ? user.id : 'admin',
        submittedByName: user ? user.name : 'Admin',
        status: data.status || 'pending', // pending | approved | rejected
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    saveContent(item);
    return item;
}

function updateContentStatus(itemId, status) {
    const items = JSON.parse(localStorage.getItem(KEYS.CONTENT) || '[]');
    const idx = items.findIndex(i => i.id === itemId);
    if (idx >= 0) {
        items[idx].status = status;
        items[idx].updatedAt = new Date().toISOString();
        localStorage.setItem(KEYS.CONTENT, JSON.stringify(items));
    }
}

// ── Notices ─────────────────────────────────────────
function getNotices() {
    return JSON.parse(localStorage.getItem(KEYS.NOTICES) || '[]');
}

function saveNotices(notices) {
    localStorage.setItem(KEYS.NOTICES, JSON.stringify(notices));
}

// ── Notifications ────────────────────────────────────
function getNotifications() {
    return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
}

function addNotification(notif) {
    const notifs = getNotifications();
    notifs.unshift({ id: 'n_' + Date.now(), ...notif, read: false, createdAt: new Date().toISOString() });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs.slice(0, 50)));
}

function markNotificationsRead() {
    const notifs = getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

// ── Admin Auth ───────────────────────────────────────
function getAdminCredentials() {
    return JSON.parse(localStorage.getItem(KEYS.ADMIN) || '{"username":"admin","password":"admin123"}');
}

function setAdminCredentials(creds) {
    localStorage.setItem(KEYS.ADMIN, JSON.stringify(creds));
}

function adminLogin(username, password) {
    const creds = getAdminCredentials();
    if (username === creds.username && password === creds.password) {
        sessionStorage.setItem('amjela_admin_logged', '1');
        return true;
    }
    return false;
}

function isAdminLoggedIn() {
    return sessionStorage.getItem('amjela_admin_logged') === '1';
}

function adminLogout() {
    sessionStorage.removeItem('amjela_admin_logged');
}

// ── Stats ────────────────────────────────────────────
function getStats() {
    const users = getUsers();
    const content = JSON.parse(localStorage.getItem(KEYS.CONTENT) || '[]');
    const pending = content.filter(c => c.status === 'pending').length;
    const approved = content.filter(c => c.status === 'approved').length;
    const rejected = content.filter(c => c.status === 'rejected').length;
    return {
        totalUsers: users.length,
        totalContent: content.length,
        pending, approved, rejected,
        totalCategories: getCategories().filter(c => c.active).length,
    };
}

// Initialize on load
if (typeof DEFAULT_CATEGORIES !== 'undefined') {
    initStore();
}
