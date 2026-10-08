// Scripted (rule-based) triage engine for the SehatRah demo.
// NOT real AI, NOT medical advice — keyword matching with canned responses.

export type TriageKind = 'emergency' | 'specialist';

export interface TriageResult {
  kind: TriageKind;
  specialty: string | null; // null for emergency
  reasonEn: string;
  reasonUr: string;
}

interface Rule {
  keywords: string[];
  specialty: string;
  reasonEn: string;
  reasonUr: string;
}

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'seenay mein dard',
  'seene mein dard',
  'seena dard',
  'saans',
  'sans nahi',
  'breathing',
  "can't breathe",
  'cant breathe',
  'behosh',
  'unconscious',
  'faint',
  'bleeding',
  'khoon',
  'blood',
  'heart attack',
  'dil ka dora',
  'stroke',
  'falij',
  'accident',
  'hadsa',
  'zehar',
  'poison',
];

const RULES: Rule[] = [
  {
    keywords: ['skin', 'kharish', 'khujli', 'itching', 'rash', 'daane', 'pimple', 'acne', 'allergy', 'chil', 'baal', 'hair fall', 'ganj', 'eczema', 'dandruff', 'khushki'],
    specialty: 'Dermatologist',
    reasonEn: 'Skin, hair and nail problems are treated by a Dermatologist.',
    reasonUr: 'Jild, baal aur nakhun ke masail ka ilaj Dermatologist karta hai.',
  },
  {
    keywords: ['kaan', 'ear', 'gala', 'throat', 'naak', 'nose', 'tonsil', 'sinus', 'hearing', 'sunai', 'awaz', 'voice', 'sardi zukam'],
    specialty: 'ENT Specialist',
    reasonEn: 'Ear, nose and throat issues are handled by an ENT Specialist.',
    reasonUr: 'Kaan, naak aur galay ke masail ENT Specialist dekhta hai.',
  },
  {
    keywords: ['daant', 'dard daant', 'teeth', 'tooth', 'dentist', 'masooray', 'gum', 'moun', 'mouth ulcer', 'chhalay'],
    specialty: 'Dentist',
    reasonEn: 'Tooth and mouth problems need a Dentist.',
    reasonUr: 'Daant aur moun ke masail ke liye Dentist se milein.',
  },
  {
    keywords: ['sugar', 'diabetes', 'thyroid', 'hormone', 'wazan', 'weight gain', 'pcos', 'vitamin d'],
    specialty: 'Endocrinologist',
    reasonEn: 'Sugar, thyroid and hormone issues are managed by an Endocrinologist.',
    reasonUr: 'Sugar, thyroid aur hormone ke masail Endocrinologist dekhta hai.',
  },
  {
    keywords: ['haddi', 'bone', 'joints', 'joron', 'knee', 'ghutna', 'kamar', 'back pain', 'gardan', 'neck pain', 'fracture', 'moch', 'arthritis', 'chot'],
    specialty: 'Orthopedic',
    reasonEn: 'Bones, joints and back problems are treated by an Orthopedic doctor.',
    reasonUr: 'Haddi, joron aur kamar ke masail ka ilaj Orthopedic doctor karta hai.',
  },
  {
    keywords: ['bacha', 'bachay', 'baby', 'child', 'kid', 'nanha', 'vaccination', 'teeka'],
    specialty: 'Pediatrician',
    reasonEn: 'For children, a Pediatrician (child specialist) is the right choice.',
    reasonUr: 'Bachon ke liye Pediatrician (child specialist) sahi choice hai.',
  },
  {
    keywords: ['aankh', 'eye', 'nazar', 'vision', 'chashma', 'glasses', 'aankh dard'],
    specialty: 'Ophthalmologist',
    reasonEn: 'Eye and vision problems need an Ophthalmologist (eye specialist).',
    reasonUr: 'Aankh aur nazar ke masail ke liye Ophthalmologist (eye specialist) se milein.',
  },
  {
    keywords: ['dil', 'heart', 'blood pressure', 'bp high', 'cholesterol', 'ecg'],
    specialty: 'Cardiologist',
    reasonEn: 'Heart and blood-pressure concerns are handled by a Cardiologist.',
    reasonUr: 'Dil aur blood pressure ke masail Cardiologist dekhta hai.',
  },
  {
    keywords: ['pregnancy', 'hamal', 'aurat', 'periods', 'mahwari', 'ultrasound'],
    specialty: 'Gynecologist',
    reasonEn: "Women's health concerns are handled by a Gynecologist.",
    reasonUr: 'Khawateen ke masail ke liye Gynecologist se milein.',
  },
  {
    keywords: ['sar dard', 'headache', 'migraine', 'sir dard', 'numbness', 'sunn', 'mirgi', 'epilepsy', 'yaaddasht', 'memory'],
    specialty: 'Neurologist',
    reasonEn: 'Headaches, nerves and brain-related concerns need a Neurologist.',
    reasonUr: 'Sar dard, aasab aur dimagh se mutaliq masail ke liye Neurologist se milein.',
  },
  {
    keywords: ['depression', 'anxiety', 'tension', 'pareshani', 'neend', 'sleep', 'stress', 'zehni'],
    specialty: 'Psychiatrist',
    reasonEn: 'Stress, anxiety, sleep and mood concerns are handled by a Psychiatrist.',
    reasonUr: 'Tension, anxiety, neend aur mood ke masail Psychiatrist dekhta hai.',
  },
];

export function triageSymptoms(input: string): TriageResult {
  const text = input.toLowerCase();

  if (EMERGENCY_KEYWORDS.some((k) => text.includes(k))) {
    return {
      kind: 'emergency',
      specialty: null,
      reasonEn: 'These symptoms can be serious. Get emergency help immediately.',
      reasonUr: 'Yeh alamat khatarnak ho sakti hain. Foran emergency madad lein.',
    };
  }

  for (const rule of RULES) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return {
        kind: 'specialist',
        specialty: rule.specialty,
        reasonEn: rule.reasonEn,
        reasonUr: rule.reasonUr,
      };
    }
  }

  return {
    kind: 'specialist',
    specialty: 'General Physician',
    reasonEn: 'No specific match found — a General Physician can examine you and refer you onward.',
    reasonUr: 'Koi khaas match nahi mila — General Physician aap ko check kar ke aagay refer kar sakta hai.',
  };
}
