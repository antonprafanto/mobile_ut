import { Module } from '@/types';

export const modules: Module[] = [
  {
    id: 'module-00',
    title: 'Prerequisites - Persiapan Dasar',
    slug: '00-prerequisites',
    order: 0,
    description: 'Dasar-dasar programming untuk pemula: JavaScript, HTML, CSS, dan Terminal',
    learningObjectives: [
      'Memahami basic JavaScript (variables, functions, loops)',
      'Mengenal HTML dan CSS dasar',
      'Menggunakan terminal/command line',
      'Memahami konsep async/await dan API',
    ],
    estimatedTime: 120,
    summary: [
      'JavaScript adalah bahasa pemrograman yang dipakai Ionic',
      'HTML untuk struktur, CSS untuk styling',
      'Terminal dipakai untuk run commands',
      'Async/await untuk handle operasi yang butuh waktu',
    ],
  },
  {
    id: 'module-01',
    title: 'Pengenalan Mobile Development & Ionic',
    slug: '01-introduction',
    order: 1,
    description: 'Memahami dasar-dasar pengembangan aplikasi mobile dengan Ionic Framework',
    learningObjectives: [
      'Memahami konsep hybrid mobile development',
      'Mengenal arsitektur Ionic Framework',
      'Memahami perbedaan native vs hybrid app',
    ],
    estimatedTime: 45,
    summary: [
      'Mobile development adalah proses pembuatan aplikasi untuk perangkat mobile',
      'Ionic adalah framework untuk membangun aplikasi mobile cross-platform',
      'Hybrid app menggunakan teknologi web untuk berjalan di berbagai platform',
    ],
  },
  {
    id: 'module-02',
    title: 'Environment Setup',
    slug: '02-environment-setup',
    order: 2,
    description: 'Menyiapkan lingkungan pengembangan untuk Ionic Framework',
    learningObjectives: [
      'Menginstall Node.js dan npm',
      'Menginstall Ionic CLI',
      'Menyiapkan VS Code untuk development',
    ],
    estimatedTime: 30,
    summary: [
      'Node.js diperlukan sebagai runtime environment',
      'Ionic CLI digunakan untuk membuat dan mengelola project',
      'VS Code adalah editor yang direkomendasikan',
    ],
  },
  {
    id: 'module-03',
    title: 'Ionic Basics',
    slug: '03-ionic-basics',
    order: 3,
    description: 'Mempelajari dasar-dasar Ionic Framework',
    learningObjectives: [
      'Memahami struktur project Ionic',
      'Membuat halaman dan komponen',
      'Memahami lifecycle hooks',
    ],
    estimatedTime: 60,
    summary: [
      'Project Ionic memiliki struktur folder yang terorganisir',
      'Pages adalah unit utama dalam aplikasi Ionic',
      'Components dapat digunakan ulang di berbagai halaman',
    ],
  },
  {
    id: 'module-04',
    title: 'UI Components',
    slug: '04-ui-components',
    order: 4,
    description: 'Mengenal komponen UI yang tersedia di Ionic',
    learningObjectives: [
      'Menggunakan komponen dasar seperti button, input, card',
      'Memahami theming dan styling',
      'Membuat layout yang responsif',
    ],
    estimatedTime: 75,
    summary: [
      'Ionic menyediakan banyak komponen UI siap pakai',
      'Komponen dapat dikustomisasi dengan CSS variables',
      'Grid system membantu membuat layout responsif',
    ],
  },
  {
    id: 'module-05',
    title: 'Navigation',
    slug: '05-navigation',
    order: 5,
    description: 'Implementasi navigasi dalam aplikasi Ionic',
    learningObjectives: [
      'Menggunakan Angular Router',
      'Membuat tabs navigation',
      'Implementasi side menu',
    ],
    estimatedTime: 60,
    summary: [
      'Router mengelola navigasi antar halaman',
      'Tabs cocok untuk navigasi utama',
      'Side menu berguna untuk menu tambahan',
    ],
  },
  {
    id: 'module-06',
    title: 'Forms',
    slug: '06-forms',
    order: 6,
    description: 'Penanganan form dan validasi input',
    learningObjectives: [
      'Membuat form dengan Reactive Forms',
      'Implementasi validasi input',
      'Menampilkan pesan error',
    ],
    estimatedTime: 60,
    summary: [
      'Reactive Forms memberikan kontrol penuh atas form',
      'Validasi memastikan data yang diinput benar',
      'Feedback visual membantu user mengisi form',
    ],
  },
  {
    id: 'module-07',
    title: 'HTTP & Data',
    slug: '07-http-data',
    order: 7,
    description: 'Komunikasi dengan server dan pengelolaan data',
    learningObjectives: [
      'Menggunakan HttpClient untuk API calls',
      'Mengelola state dengan services',
      'Handling loading dan error states',
    ],
    estimatedTime: 75,
    summary: [
      'HttpClient digunakan untuk komunikasi dengan API',
      'Services menyimpan dan mengelola data',
      'Loading states memberikan feedback ke user',
    ],
  },
  {
    id: 'module-08',
    title: 'Native Features',
    slug: '08-native-features',
    order: 8,
    description: 'Mengakses fitur native device',
    learningObjectives: [
      'Menggunakan Capacitor plugins',
      'Mengakses kamera dan galeri',
      'Menggunakan geolocation',
    ],
    estimatedTime: 90,
    summary: [
      'Capacitor menjembatani web app dengan native features',
      'Camera plugin untuk mengambil foto',
      'Geolocation untuk mendapatkan lokasi user',
    ],
  },
  {
    id: 'module-09',
    title: 'State Management',
    slug: '09-state-management',
    order: 9,
    description: 'Pengelolaan state aplikasi',
    learningObjectives: [
      'Memahami konsep state management',
      'Menggunakan services untuk state',
      'Implementasi reactive patterns',
    ],
    estimatedTime: 60,
    summary: [
      'State management penting untuk aplikasi kompleks',
      'Services dapat menyimpan shared state',
      'RxJS membantu mengelola data streams',
    ],
  },
  {
    id: 'module-10',
    title: 'Deployment',
    slug: '10-deployment',
    order: 10,
    description: 'Build dan deploy aplikasi ke app stores',
    learningObjectives: [
      'Build aplikasi untuk production',
      'Deploy ke Android Play Store',
      'Deploy ke iOS App Store',
    ],
    estimatedTime: 90,
    summary: [
      'Build production mengoptimalkan ukuran aplikasi',
      'Play Store memerlukan signed APK/AAB',
      'App Store memerlukan Apple Developer account',
    ],
  },
  {
    id: 'module-11',
    title: 'Final Project',
    slug: '11-final-project',
    order: 11,
    description: 'Membuat aplikasi lengkap dari awal hingga akhir',
    learningObjectives: [
      'Menerapkan semua konsep yang dipelajari',
      'Membuat aplikasi todo list lengkap',
      'Deploy aplikasi ke device',
    ],
    estimatedTime: 120,
    summary: [
      'Project akhir mengintegrasikan semua materi',
      'Aplikasi todo list mencakup CRUD operations',
      'Testing di device memastikan aplikasi berjalan baik',
    ],
  },
  {
    id: 'module-12',
    title: 'Advanced Topics (Bonus)',
    slug: '12-advanced-topics',
    order: 12,
    description: 'Topik lanjutan: Debugging, Testing, Animations, dan Security',
    learningObjectives: [
      'Menguasai debugging dengan Chrome DevTools',
      'Menulis unit dan E2E tests',
      'Membuat animasi dan gestures',
      'Implementasi security best practices',
    ],
    estimatedTime: 90,
    summary: [
      'Debugging menggunakan Chrome DevTools dan remote debugging',
      'Testing dengan Jest untuk unit tests dan Playwright untuk E2E',
      'Animations menggunakan Ionic Animations API dan CSS',
      'Security meliputi token storage, input sanitization, dan CSP',
    ],
  },
];

export function getModuleById(id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find(m => m.slug === slug);
}

export function getTotalModules(): number {
  return modules.length;
}
