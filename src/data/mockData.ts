export type Role =
  | 'super_admin'
  | 'constituency_coordinator'
  | 'ward_coordinator'
  | 'booth_coordinator'
  | 'volunteer';
export type VoterStatus = 'not_contacted' | 'contacted' | 'supportive' | 'undecided' | 'opposed';
export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type EventType = 'rally' | 'meeting' | 'door_to_door';

export interface Ward {
  id: string;
  name: string;
  nameHi: string;
  totalVoters: number;
  members: number;
  contacted: number;
  coordinator: string;
  boothCount: number;
}

export interface Booth {
  id: string;
  wardId: string;
  name: string;
  totalVoters: number;
  members: number;
  contacted: number;
  coordinator: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  wardId: string;
  boothId: string;
  village: string;
  epicNo?: string;
  joinDate: string;
  status: 'active' | 'pending';
}

export interface Voter {
  epicNo: string;
  name: string;
  age: number;
  address: string;
  boothId: string;
  status: VoterStatus;
  memberId?: string;
}

export interface Task {
  id: string;
  title: string;
  titleHi: string;
  type: 'door_to_door' | 'phone_call' | 'event' | 'data_entry';
  boothId: string;
  dueDate: string;
  status: TaskStatus;
}

export interface CampaignEvent {
  id: string;
  title: string;
  titleHi: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  wardId: string;
  rsvp: number;
  attended: number;
}

export const currentUser = {
  name: 'Priya Kumari',
  nameHi: 'प्रिया कुमारी',
  role: 'ward_coordinator' as Role,
  wardId: 'w4',
  phone: '9801234567',
};

export const wards: Ward[] = [
  {
    id: 'w1',
    name: 'Bishrampur North',
    nameHi: 'बिश्रामपुर उत्तर',
    totalVoters: 4850,
    members: 312,
    contacted: 3399,
    coordinator: 'Rajesh Verma',
    boothCount: 4,
  },
  {
    id: 'w2',
    name: 'Bishrampur South',
    nameHi: 'बिश्रामपुर दक्षिण',
    totalVoters: 5120,
    members: 289,
    contacted: 2867,
    coordinator: 'Sunita Devi',
    boothCount: 4,
  },
  {
    id: 'w3',
    name: 'Hussainabad',
    nameHi: 'हुसैनाबाद',
    totalVoters: 3980,
    members: 198,
    contacted: 1990,
    coordinator: 'Mohammed Arif',
    boothCount: 3,
  },
  {
    id: 'w4',
    name: 'Chainpur',
    nameHi: 'चैनपुर',
    totalVoters: 4420,
    members: 340,
    contacted: 3407,
    coordinator: 'Priya Kumari',
    boothCount: 4,
  },
  {
    id: 'w5',
    name: 'Patan',
    nameHi: 'पाटन',
    totalVoters: 3650,
    members: 156,
    contacted: 1569,
    coordinator: 'Vijay Singh',
    boothCount: 3,
  },
  {
    id: 'w6',
    name: 'Daltonganj West',
    nameHi: 'डालटेनगंज पश्चिम',
    totalVoters: 6200,
    members: 415,
    contacted: 4154,
    coordinator: 'Anita Prasad',
    boothCount: 5,
  },
];

export const booths: Booth[] = [
  {
    id: 'b1',
    wardId: 'w4',
    name: 'Govt. Primary School No. 1',
    totalVoters: 1100,
    members: 88,
    contacted: 847,
    coordinator: 'Manoj Tiwari',
  },
  {
    id: 'b2',
    wardId: 'w4',
    name: 'Panchayat Bhavan, Chainpur',
    totalVoters: 1200,
    members: 95,
    contacted: 936,
    coordinator: 'Geeta Kumari',
  },
  {
    id: 'b3',
    wardId: 'w4',
    name: 'Community Hall, Naya Bazar',
    totalVoters: 1050,
    members: 79,
    contacted: 788,
    coordinator: 'Atul Prasad',
  },
  {
    id: 'b4',
    wardId: 'w4',
    name: 'Middle School, Hardu Toli',
    totalVoters: 1070,
    members: 78,
    contacted: 836,
    coordinator: 'Rita Singh',
  },
  {
    id: 'b5',
    wardId: 'w1',
    name: 'Govt. School, Bishrampur',
    totalVoters: 1250,
    members: 89,
    contacted: 1000,
    coordinator: 'Deepak Kumar',
  },
  {
    id: 'b6',
    wardId: 'w1',
    name: 'Mission School Hall',
    totalVoters: 1100,
    members: 76,
    contacted: 792,
    coordinator: 'Sarita Devi',
  },
  {
    id: 'b7',
    wardId: 'w6',
    name: 'Urban Health Centre',
    totalVoters: 1400,
    members: 102,
    contacted: 1176,
    coordinator: 'Neha Srivastava',
  },
];

export const members: Member[] = [
  {
    id: 'JY-2024-00001',
    name: 'Ramesh Kumar Singh',
    phone: '9876543210',
    wardId: 'w4',
    boothId: 'b1',
    village: 'Naya Tola',
    epicNo: 'JHK1234567',
    joinDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'JY-2024-00002',
    name: 'Sunita Devi',
    phone: '9876543211',
    wardId: 'w4',
    boothId: 'b1',
    village: 'Purana Bazar',
    epicNo: 'JHK1234568',
    joinDate: '2024-01-16',
    status: 'active',
  },
  {
    id: 'JY-2024-00003',
    name: 'Ajay Kumar Gupta',
    phone: '9876543212',
    wardId: 'w4',
    boothId: 'b2',
    village: 'Chainpur Main',
    epicNo: 'JHK1234569',
    joinDate: '2024-01-18',
    status: 'active',
  },
  {
    id: 'JY-2024-00004',
    name: 'Meera Devi',
    phone: '9876543213',
    wardId: 'w4',
    boothId: 'b2',
    village: 'Hardu Toli',
    joinDate: '2024-01-20',
    status: 'active',
  },
  {
    id: 'JY-2024-00005',
    name: 'Vikram Singh Yadav',
    phone: '9876543214',
    wardId: 'w4',
    boothId: 'b3',
    village: 'Naya Bazar',
    epicNo: 'JHK1234571',
    joinDate: '2024-01-22',
    status: 'active',
  },
  {
    id: 'JY-2024-00006',
    name: 'Rekha Kumari',
    phone: '9876543215',
    wardId: 'w4',
    boothId: 'b3',
    village: 'Station Road',
    joinDate: '2024-01-23',
    status: 'pending',
  },
  {
    id: 'JY-2024-00007',
    name: 'Suresh Prasad Sahu',
    phone: '9876543216',
    wardId: 'w4',
    boothId: 'b4',
    village: 'Karbala Road',
    epicNo: 'JHK1234573',
    joinDate: '2024-01-25',
    status: 'active',
  },
  {
    id: 'JY-2024-00008',
    name: 'Poonam Singh',
    phone: '9876543217',
    wardId: 'w4',
    boothId: 'b4',
    village: 'Hardu Toli',
    joinDate: '2024-01-26',
    status: 'active',
  },
  {
    id: 'JY-2024-00009',
    name: 'Dinesh Kumar Mahto',
    phone: '9876543218',
    wardId: 'w1',
    boothId: 'b5',
    village: 'Bishrampur',
    epicNo: 'JHK1234575',
    joinDate: '2024-02-01',
    status: 'active',
  },
  {
    id: 'JY-2024-00010',
    name: 'Kamla Devi',
    phone: '9876543219',
    wardId: 'w1',
    boothId: 'b6',
    village: 'Mission Compound',
    joinDate: '2024-02-03',
    status: 'active',
  },
  {
    id: 'JY-2024-00011',
    name: 'Bhola Nath Tiwari',
    phone: '9876543220',
    wardId: 'w6',
    boothId: 'b7',
    village: 'Daltonganj',
    epicNo: 'JHK1234577',
    joinDate: '2024-02-05',
    status: 'active',
  },
  {
    id: 'JY-2024-00012',
    name: 'Rani Devi',
    phone: '9876543221',
    wardId: 'w4',
    boothId: 'b1',
    village: 'Naya Tola',
    joinDate: '2024-02-07',
    status: 'active',
  },
];

export const voters: Voter[] = [
  {
    epicNo: 'JHK1234567',
    name: 'Ramesh Kumar Singh',
    age: 42,
    address: 'H.No. 12, Naya Tola, Chainpur',
    boothId: 'b1',
    status: 'supportive',
    memberId: 'JY-2024-00001',
  },
  {
    epicNo: 'JHK1234568',
    name: 'Sunita Devi',
    age: 38,
    address: 'Ward No. 4, Purana Bazar',
    boothId: 'b1',
    status: 'supportive',
    memberId: 'JY-2024-00002',
  },
  {
    epicNo: 'JHK1234570',
    name: 'Raju Prasad',
    age: 55,
    address: 'Naya Tola Main Road',
    boothId: 'b1',
    status: 'contacted',
  },
  {
    epicNo: 'JHK1234572',
    name: 'Laxmi Devi',
    age: 47,
    address: 'Near Post Office, Chainpur',
    boothId: 'b1',
    status: 'undecided',
  },
  {
    epicNo: 'JHK1234574',
    name: 'Ramnarayan Singh',
    age: 61,
    address: 'Station Road, Chainpur',
    boothId: 'b1',
    status: 'opposed',
  },
  {
    epicNo: 'JHK1234576',
    name: 'Geeta Kumari',
    age: 34,
    address: 'Behind Bus Stand, Ward 4',
    boothId: 'b1',
    status: 'not_contacted',
  },
  {
    epicNo: 'JHK1234577',
    name: 'Birendra Kumar',
    age: 29,
    address: 'New Colony, Chainpur',
    boothId: 'b1',
    status: 'not_contacted',
  },
  {
    epicNo: 'JHK1234578',
    name: 'Savitri Devi',
    age: 52,
    address: 'Patel Nagar, Ward 4',
    boothId: 'b1',
    status: 'contacted',
  },
  {
    epicNo: 'JHK1234579',
    name: 'Yogesh Kumar Yadav',
    age: 44,
    address: 'Yadav Mohalla, Chainpur',
    boothId: 'b1',
    status: 'supportive',
  },
  {
    epicNo: 'JHK1234580',
    name: 'Phool Kumari',
    age: 67,
    address: 'Old Market Area, Chainpur',
    boothId: 'b1',
    status: 'not_contacted',
  },
  {
    epicNo: 'JHK1234581',
    name: 'Shyam Sundar Gupta',
    age: 58,
    address: 'Gupta Tola, Ward 4',
    boothId: 'b2',
    status: 'supportive',
    memberId: 'JY-2024-00003',
  },
  {
    epicNo: 'JHK1234582',
    name: 'Pushpa Devi',
    age: 45,
    address: 'Ward No. 4, Near Temple',
    boothId: 'b2',
    status: 'contacted',
  },
  {
    epicNo: 'JHK1234583',
    name: 'Ajay Kumar',
    age: 33,
    address: 'New Market, Chainpur',
    boothId: 'b2',
    status: 'undecided',
  },
];

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'Door-to-door survey — Naya Tola',
    titleHi: 'घर-घर सर्वे — नया टोला',
    type: 'door_to_door',
    boothId: 'b1',
    dueDate: '2024-09-17',
    status: 'in_progress',
  },
  {
    id: 't2',
    title: 'Phone follow-up with undecided voters',
    titleHi: 'अनिर्णीत मतदाताओं को फोन',
    type: 'phone_call',
    boothId: 'b2',
    dueDate: '2024-09-17',
    status: 'pending',
  },
  {
    id: 't3',
    title: 'Enter new members from paper forms',
    titleHi: 'नए सदस्यों का डेटा दर्ज करें',
    type: 'data_entry',
    boothId: 'b1',
    dueDate: '2024-09-17',
    status: 'pending',
  },
  {
    id: 't4',
    title: 'Event check-in — Jana Sabha',
    titleHi: 'जन सभा उपस्थिति दर्ज करें',
    type: 'event',
    boothId: 'b3',
    dueDate: '2024-09-18',
    status: 'pending',
  },
  {
    id: 't5',
    title: 'Street corner meeting — Station Road',
    titleHi: 'नुक्कड़ सभा — स्टेशन रोड',
    type: 'door_to_door',
    boothId: 'b4',
    dueDate: '2024-09-16',
    status: 'done',
  },
  {
    id: 't6',
    title: 'Booth worker coordination call',
    titleHi: 'बूथ कार्यकर्ता समन्वय कॉल',
    type: 'phone_call',
    boothId: 'b3',
    dueDate: '2024-09-16',
    status: 'done',
  },
];

export const events: CampaignEvent[] = [
  {
    id: 'e1',
    title: 'Chainpur Jana Sabha',
    titleHi: 'चैनपुर जन सभा',
    date: '2024-09-18',
    time: '4:00 PM',
    location: 'Chainpur Ground, Bus Stand Road',
    type: 'rally',
    wardId: 'w4',
    rsvp: 234,
    attended: 0,
  },
  {
    id: 'e2',
    title: 'Booth Workers Meeting — Ward 4',
    titleHi: 'बूथ कार्यकर्ता बैठक — वार्ड 4',
    date: '2024-09-20',
    time: '10:00 AM',
    location: 'Panchayat Bhavan, Chainpur',
    type: 'meeting',
    wardId: 'w4',
    rsvp: 45,
    attended: 0,
  },
  {
    id: 'e3',
    title: 'Door-to-Door Drive: Hardu Toli',
    titleHi: 'घर-घर अभियान: हरदू टोली',
    date: '2024-09-22',
    time: '8:00 AM',
    location: 'Hardu Toli, Ward 4',
    type: 'door_to_door',
    wardId: 'w4',
    rsvp: 12,
    attended: 0,
  },
  {
    id: 'e4',
    title: 'Patan Mohalla Meeting',
    titleHi: 'पाटन मोहल्ला बैठक',
    date: '2024-09-15',
    time: '6:00 PM',
    location: 'Patan Chowk',
    type: 'meeting',
    wardId: 'w5',
    rsvp: 67,
    attended: 58,
  },
];

export const statusLabels: Record<
  VoterStatus,
  { en: string; hi: string; color: string; bg: string }
> = {
  not_contacted: { en: 'Not Contacted', hi: 'संपर्क नहीं', color: '#6B7280', bg: '#F3F4F6' },
  contacted: { en: 'Contacted', hi: 'संपर्क हुआ', color: '#2563EB', bg: '#DBEAFE' },
  supportive: { en: 'Supportive', hi: 'समर्थक', color: '#15803D', bg: '#DCFCE7' },
  undecided: { en: 'Undecided', hi: 'अनिर्णीत', color: '#B45309', bg: '#FEF3C7' },
  opposed: { en: 'Opposed', hi: 'विरोधी', color: '#DC2626', bg: '#FEE2E2' },
};
