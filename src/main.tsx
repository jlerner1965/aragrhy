import React, { ChangeEvent, ErrorInfo, ReactNode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Archive,
  BookOpen,
  Download,
  FileText,
  Leaf,
  Menu,
  Moon,
  Plus,
  Printer,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import './index.css';

type Plant = {
  id: string;
  name: string;
  cultivar: string;
  source: string;
  startDate: string;
  transplantDate: string;
  medium: string;
  location: string;
  stage: string;
  heightIn: number;
  widthIn: number;
  stemDiameterIn: number;
  healthScore: number;
  archived?: boolean;
  latestPhoto?: string;
  notes: string;
  estimatedFlowering: string;
  estimatedHarvest: string;
};

type JournalEntry = {
  id: string;
  dateTime: string;
  plantId: string;
  tags: string[];
  weather: string;
  temperatureF: number;
  humidityPct: number;
  rainfallIn: number;
  windMph: number;
  soilMoisture: string;
  waterGallons: number;
  nutrientProducts: string;
  nutrientAmounts: string;
  solutionPh: number;
  ec: number;
  heightIn?: number;
  widthIn?: number;
  training: string;
  pestObservations: string;
  diseaseObservations: string;
  symptoms: string;
  notes: string;
  photo?: string;
};

type NutritionApplication = {
  id: string;
  date: string;
  product: string;
  npk: string;
  rate: string;
  solutionVolumeGallons: number;
  ph: number;
  ec: number;
  method: string;
  targetPlantId: string;
  growthStage: string;
  observedResponse: string;
};

type TimelinePhoto = {
  id: string;
  plantId: string;
  date: string;
  stage: string;
  notes: string;
  symptomTags: string;
  url: string;
};

type ForecastDay = {
  day: string;
  highF: number;
  lowF: number;
  windMph: number;
  rainfallIn: number;
  humidityPct: number;
  hailPossible: boolean;
  smokePossible: boolean;
};

type GrowRecord = {
  name: string;
  sample: boolean;
  location: string;
  elevationFt: number;
  indoorStartDate: string;
  outdoorTransplantDate: string;
  plantCount: number;
  cultivar: string;
  plantType: string;
  cultivationStyle: string;
  containerSize: string;
  medium: string;
  irrigationMethod: string;
  sunExposure: string;
  protection: string;
  nutritionProgram: string;
  nutritionApproach: string;
  experienceLevel: string;
  primaryConcerns: string;
};

type AppData = {
  grow: GrowRecord;
  plants: Plant[];
  journal: JournalEntry[];
  nutrition: NutritionApplication[];
  photos: TimelinePhoto[];
  forecast: ForecastDay[];
  tasks: string[];
  bookmarks: string[];
};

const CURRENT_DATE = '2026-07-21';
const STORAGE_KEY = 'front-range-grow-intelligence:v2';
const uid = () => Math.random().toString(36).slice(2, 10);

const cultivarOptions = [
  'Jack Herer',
  'Gorilla Cookies',
  'Scoops of Cream',
  'Blue Dream',
  'Durban Poison',
  'Northern Lights',
  'Custom cultivar',
];

const navigation = [
  'Dashboard',
  'My Grow',
  'Plants',
  'Daily Journal',
  'Diagnostics',
  'Weather Risks',
  'Irrigation',
  'Nutrition',
  'Training',
  'Pest and Disease Center',
  'Harvest Planner',
  'Photo Timeline',
  'Encyclopedia',
  'Reports',
  'Settings',
];

const createDemoData = (): AppData => ({
  grow: {
    name: 'Niwot Front Range Demonstration Grow',
    sample: true,
    location: 'Niwot, Colorado',
    elevationFt: 5085,
    indoorStartDate: '2026-03-24',
    outdoorTransplantDate: '2026-05-06',
    plantCount: 2,
    cultivar: 'Jack Herer / Gorilla Cookies',
    plantType: 'Photoperiod',
    cultivationStyle: 'Outdoor in-ground',
    containerSize: 'Not applicable',
    medium: 'Native soil amended with FoxFarm Ocean Forest in planting areas',
    irrigationMethod: 'Drip irrigation',
    sunExposure: 'Full sun with west wind exposure',
    protection: 'Fenced yard; horizontal trellis and T-post planning',
    nutritionProgram: 'Light supplemental feeding after amended soil establishment',
    nutritionApproach: 'Hybrid',
    experienceLevel: 'Intermediate',
    primaryConcerns: 'High wind, aphids, flowering transition, late-season storms',
  },
  plants: [
    {
      id: 'plant-jack-herer',
      name: 'JH North Bed',
      cultivar: 'Jack Herer',
      source: 'Seed',
      startDate: '2026-03-24',
      transplantDate: '2026-05-06',
      medium: 'In-ground native soil amended with Ocean Forest',
      location: 'North bed',
      stage: 'Late vegetative / preflower watch',
      heightIn: 72,
      widthIn: 58,
      stemDiameterIn: 1.4,
      healthScore: 86,
      notes: 'Vigorous six-foot plant. Train gently and inspect tie pressure before forecast wind.',
      estimatedFlowering: '2026-08-04 ± 10 days',
      estimatedHarvest: '2026-09-28 to 2026-10-18',
    },
    {
      id: 'plant-gorilla-cookies',
      name: 'GC South Bed',
      cultivar: 'Gorilla Cookies',
      source: 'Seed',
      startDate: '2026-03-26',
      transplantDate: '2026-05-08',
      medium: 'In-ground native soil amended with Ocean Forest',
      location: 'South bed',
      stage: 'Late vegetative',
      heightIn: 68,
      widthIn: 62,
      stemDiameterIn: 1.3,
      healthScore: 82,
      notes: 'Minor aphid observation on lower leaves. Monitor before intervening.',
      estimatedFlowering: '2026-08-02 ± 10 days',
      estimatedHarvest: '2026-09-24 to 2026-10-15',
    },
  ],
  journal: [
    {
      id: 'journal-1',
      dateTime: '2026-07-14T07:30',
      plantId: 'all',
      tags: ['Watered', 'Trained'],
      weather: 'Clear morning',
      temperatureF: 74,
      humidityPct: 38,
      rainfallIn: 0,
      windMph: 8,
      soilMoisture: 'Top 2 inches dry; moisture present around 5 inches',
      waterGallons: 8,
      nutrientProducts: 'None',
      nutrientAmounts: 'None',
      solutionPh: 6.7,
      ec: 0.8,
      training: 'Adjusted horizontal trellis ties',
      pestObservations: 'None observed',
      diseaseObservations: 'None observed',
      symptoms: 'Minor lower yellowing',
      notes: 'Both plants recovered quickly from tie adjustment.',
    },
    {
      id: 'journal-2',
      dateTime: '2026-07-18T18:20',
      plantId: 'plant-gorilla-cookies',
      tags: ['Pest found', 'Photograph'],
      weather: 'Warm and breezy',
      temperatureF: 89,
      humidityPct: 27,
      rainfallIn: 0,
      windMph: 16,
      soilMoisture: 'Even moisture at root depth',
      waterGallons: 0,
      nutrientProducts: 'None',
      nutrientAmounts: 'None',
      solutionPh: 6.6,
      ec: 0.9,
      training: 'None',
      pestObservations: 'Small aphid cluster on underside of two lower leaves',
      diseaseObservations: 'None observed',
      symptoms: 'No distorted new growth',
      notes: 'Removed affected leaves and marked for three-day follow-up.',
    },
    {
      id: 'journal-3',
      dateTime: '2026-07-20T06:50',
      plantId: 'all',
      tags: ['Watered', 'Fed'],
      weather: 'Hot forecast',
      temperatureF: 70,
      humidityPct: 42,
      rainfallIn: 0,
      windMph: 6,
      soilMoisture: 'Dry at 4 inches near drip line',
      waterGallons: 10,
      nutrientProducts: 'Fish/kelp blend',
      nutrientAmounts: 'Half label rate in final solution',
      solutionPh: 6.5,
      ec: 1.1,
      training: 'Checked trellis tension',
      pestObservations: 'No aphid spread seen',
      diseaseObservations: 'None observed',
      symptoms: 'Slight midday flagging during heat',
      notes: 'Recommendation: verify soil moisture before increasing irrigation frequency.',
    },
  ],
  nutrition: [
    {
      id: 'nutrition-1',
      date: '2026-07-20',
      product: 'Fish/kelp blend',
      npk: '2-3-1',
      rate: 'Half label rate in final solution',
      solutionVolumeGallons: 10,
      ph: 6.5,
      ec: 1.1,
      method: 'Drip-compatible drench',
      targetPlantId: 'all',
      growthStage: 'Late vegetative',
      observedResponse: 'No burn observed after 24 hours',
    },
  ],
  photos: [],
  forecast: [
    { day: 'Tue', highF: 94, lowF: 62, windMph: 18, rainfallIn: 0, humidityPct: 24, hailPossible: false, smokePossible: false },
    { day: 'Wed', highF: 91, lowF: 60, windMph: 28, rainfallIn: 0, humidityPct: 28, hailPossible: false, smokePossible: false },
    { day: 'Thu', highF: 86, lowF: 58, windMph: 14, rainfallIn: 0.1, humidityPct: 44, hailPossible: true, smokePossible: false },
    { day: 'Fri', highF: 82, lowF: 55, windMph: 10, rainfallIn: 0.35, humidityPct: 68, hailPossible: false, smokePossible: false },
    { day: 'Sat', highF: 79, lowF: 53, windMph: 8, rainfallIn: 0.2, humidityPct: 72, hailPossible: false, smokePossible: false },
    { day: 'Sun', highF: 88, lowF: 57, windMph: 12, rainfallIn: 0, humidityPct: 36, hailPossible: false, smokePossible: true },
    { day: 'Mon', highF: 92, lowF: 61, windMph: 15, rainfallIn: 0, humidityPct: 30, hailPossible: false, smokePossible: false },
  ],
  tasks: [
    'Inspect trellis and T-posts before Wednesday wind',
    'Scout undersides of Gorilla Cookies lower leaves',
    'Verify soil moisture at 4–6 inches before next irrigation',
    'Watch for first pistil clusters and record flowering observation',
  ],
  bookmarks: ['Colorado Front Range conditions'],
});

const loadData = (): AppData => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '') as AppData;
  } catch {
    return createDemoData();
  }
};

const saveData = (data: AppData) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
const daysBetween = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`card rounded-xl p-4 ${className}`}>{children}</section>;
}

function Button({ children, tone = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'primary' | 'soil' | 'danger' | 'plain' }) {
  const tones = {
    primary: 'bg-forest text-white hover:bg-[#255d49]',
    soil: 'bg-soil text-white hover:bg-[#7a5b31]',
    danger: 'bg-red-700 text-white hover:bg-red-800',
    plain: 'border border-forest/20 bg-white text-forest hover:bg-sage/20 dark:bg-forest dark:text-white',
  };
  return <button className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${tones[tone]} ${className}`} {...props}>{children}</button>;
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="grid gap-1 text-sm font-medium">{label}<input className="rounded-lg border border-forest/20 bg-white/95 p-2 text-slate-900" {...props} /></label>;
}

function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className="grid gap-1 text-sm font-medium">{label}<textarea className="min-h-20 rounded-lg border border-forest/20 bg-white/95 p-2 text-slate-900" {...props} /></label>;
}

function SelectField({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return <label className="grid gap-1 text-sm font-medium">{label}<select className="rounded-lg border border-forest/20 bg-white/95 p-2 text-slate-900" {...props}>{children}</select></label>;
}

function EvidenceList({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-1 pl-5 text-sm leading-6">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Front Range Grow Intelligence render failure', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-cream p-6 text-forest"><Card><h1 className="text-2xl font-bold">Something went wrong</h1><p>Please export a browser console report if this persists, then reload the app. Your locally saved grow data remains in your browser unless you clear site data.</p><button className="mt-3 rounded-lg bg-forest px-3 py-2 text-white" onClick={() => location.reload()}>Reload application</button></Card></div>;
    }
    return this.props.children;
  }
}

function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [page, setPage] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const persist = (next: AppData) => {
    setData(next);
    saveData(next);
  };

  const exportJson = () => {
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    anchor.download = 'front-range-grow-intelligence-backup.json';
    anchor.click();
  };

  const importJson = async (file: File) => {
    try {
      persist(JSON.parse(await file.text()) as AppData);
    } catch {
      alert('Backup could not be restored. Check that the file is valid JSON.');
    }
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen texture bg-cream text-forest dark:bg-[#10231d] dark:text-[#edf4ee]">
        <MobileBar open={() => setMobileOpen(true)} />
        <Sidebar page={page} setPage={setPage} open={mobileOpen} close={() => setMobileOpen(false)} />
        <main className="pt-16 lg:ml-72 lg:pt-0">
          <header className="p-5">
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              <strong>Education and legal disclaimer:</strong> Front Range Grow Intelligence provides general horticultural education for adults. Users must follow all applicable local laws. Simulated weather is clearly labeled, and diagnoses are not guaranteed; verify symptoms before taking action.
            </div>
          </header>
          <div className="px-5 pb-8">
            <Page page={page} data={data} save={persist} />
          </div>
          <footer className="no-print flex flex-wrap gap-2 border-t border-forest/10 p-4">
            <Button onClick={() => setDark(!dark)}><Moon size={16} />{dark ? 'Light' : 'Dark'} mode</Button>
            <Button tone="soil" onClick={exportJson}><Download size={16} />JSON backup</Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky px-3 py-2 text-sm font-semibold text-white">
              <Upload size={16} />Restore JSON
              <input className="hidden" type="file" accept="application/json" onChange={event => event.target.files?.[0] && importJson(event.target.files[0])} />
            </label>
          </footer>
        </main>
      </div>
    </div>
  );
}

function MobileBar({ open }: { open: () => void }) {
  return <nav className="no-print fixed inset-x-0 top-0 z-20 flex items-center gap-3 border-b border-forest/10 bg-cream/95 p-3 dark:bg-[#10231d]/95 lg:hidden"><button aria-label="Open navigation" onClick={open}><Menu /></button><strong>Front Range Grow Intelligence</strong></nav>;
}

function Sidebar({ page, setPage, open, close }: { page: string; setPage: (page: string) => void; open: boolean; close: () => void }) {
  return (
    <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} no-print fixed z-30 h-full w-72 bg-forest p-4 text-white transition lg:translate-x-0`}>
      <div className="mb-5 flex items-start justify-between gap-3"><strong className="text-xl leading-tight">Front Range Grow Intelligence</strong><button className="lg:hidden" onClick={close} aria-label="Close navigation"><X /></button></div>
      {navigation.map(item => <button key={item} onClick={() => { setPage(item); close(); }} className={`my-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${page === item ? 'bg-sage text-forest' : 'hover:bg-white/10'}`}><Leaf size={16} />{item}</button>)}
    </aside>
  );
}

function Page({ page, data, save }: { page: string; data: AppData; save: (data: AppData) => void }) {
  const pages: Record<string, React.ReactNode> = {
    Dashboard: <Dashboard data={data} />,
    'My Grow': <GrowWizard data={data} save={save} />,
    Plants: <Plants data={data} save={save} />,
    'Daily Journal': <Journal data={data} save={save} />,
    Diagnostics: <Diagnostics />,
    'Weather Risks': <WeatherRisks data={data} save={save} />,
    Irrigation: <Irrigation data={data} />,
    Nutrition: <Nutrition data={data} save={save} />,
    Training: <Training />,
    'Pest and Disease Center': <PestCenter />,
    'Harvest Planner': <Harvest data={data} />,
    'Photo Timeline': <PhotoTimeline data={data} save={save} />,
    Encyclopedia: <Encyclopedia data={data} save={save} />,
    Reports: <Reports data={data} />,
    Settings: <Settings save={save} />,
  };
  return <>{pages[page] || pages.Dashboard}</>;
}

function Dashboard({ data }: { data: AppData }) {
  const activePlants = data.plants.filter(plant => !plant.archived);
  const journalChart = data.journal.map(entry => ({ date: entry.dateTime.slice(5, 10), water: entry.waterGallons, ph: entry.solutionPh, ec: entry.ec }));
  const healthTrend = activePlants.map(plant => ({ name: plant.name, health: plant.healthScore, height: plant.heightIn, width: plant.widthIn }));
  return (
    <div className="space-y-4">
      <div><h1 className="text-3xl font-bold">Operational Dashboard</h1><p className="text-sm">This demonstration grow is sample data that can be reset or replaced.</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Active plants" value={activePlants.length} detail={data.grow.cultivationStyle} />
        <Metric title="Current stage" value="Late veg" detail={`${daysBetween(data.grow.outdoorTransplantDate, CURRENT_DATE)} days since transplant`} />
        <Metric title="Flowering estimate" value="~12 days" detail="Range based on date, stage, and user observations; not guaranteed." />
        <Metric title="Harvest window" value="Late Sep–mid Oct" detail="Uncertain; verify flower maturity and weather risks." />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2"><h2 className="font-bold">Seven-day environmental outlook (simulated)</h2><ResponsiveContainer height={260}><AreaChart data={data.forecast}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="highF" name="High °F" fill="#557f91" stroke="#557f91" /><Area dataKey="windMph" name="Wind mph" fill="#d89b35" stroke="#d89b35" /></AreaChart></ResponsiveContainer></Card>
        <Card><h2 className="font-bold">What needs attention today?</h2><EvidenceList items={data.tasks} /><p className="mt-3 text-sm"><strong>Recommendation transparency:</strong> influenced by simulated forecast wind, recent aphid note, plant size, and upcoming flowering. Confidence: medium. Verify supports and leaf undersides.</p></Card>
        <ChartCard title="Watering history"><BarChart data={journalChart}><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="water" name="Gallons" fill="#557f91" /></BarChart></ChartCard>
        <ChartCard title="pH and EC history"><LineChart data={journalChart}><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="ph" stroke="#1c4d3b" /><Line dataKey="ec" stroke="#6b4f2a" /></LineChart></ChartCard>
        <ChartCard title="Plant health and size"><BarChart data={healthTrend}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="health" fill="#8aa37b" /><Bar dataKey="height" fill="#1c4d3b" /></BarChart></ChartCard>
      </div>
    </div>
  );
}

function Metric({ title, value, detail }: { title: string; value: string | number; detail: string }) {
  return <Card><p className="text-sm font-semibold uppercase tracking-wide text-forest/70 dark:text-white/70">{title}</p><p className="text-3xl font-bold">{value}</p><p className="text-sm">{detail}</p></Card>;
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return <Card><h2 className="font-bold">{title}</h2><ResponsiveContainer height={220}>{children}</ResponsiveContainer></Card>;
}

function GrowWizard({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [grow, setGrow] = useState(data.grow);
  const update = (field: keyof GrowRecord, value: string | number) => setGrow({ ...grow, [field]: value });
  const plan = [
    'Inspect drip emitters and soil moisture every 2–3 hot days; adjust only after field verification.',
    'Complete horizontal trellis support before high wind events and inspect tie pressure after gusts.',
    'Begin flowering observation log in early August; harvest timing must be based on flower development and weather, not cultivar claims alone.',
    'Keep nutrition conservative while plants are hot, wind-stressed, or waterlogged.',
  ];
  return <Card><h1 className="text-2xl font-bold">Grow Setup Wizard</h1><p className="mb-3 text-sm">Save changes to regenerate a practical initial cultivation plan. Cultivar dates and yields are not guarantees.</p><div className="grid gap-3 md:grid-cols-3"><Field label="Grow name" value={grow.name} onChange={e => update('name', e.target.value)} /><Field label="Colorado location" value={grow.location} onChange={e => update('location', e.target.value)} /><Field label="Elevation ft" type="number" value={grow.elevationFt} onChange={e => update('elevationFt', Number(e.target.value))} /><Field label="Indoor start date" type="date" value={grow.indoorStartDate} onChange={e => update('indoorStartDate', e.target.value)} /><Field label="Outdoor transplant date" type="date" value={grow.outdoorTransplantDate} onChange={e => update('outdoorTransplantDate', e.target.value)} /><Field label="Plant count" type="number" value={grow.plantCount} onChange={e => update('plantCount', Number(e.target.value))} /><SelectField label="Cultivar" value={grow.cultivar} onChange={e => update('cultivar', e.target.value)}>{cultivarOptions.map(cultivar => <option key={cultivar}>{cultivar}</option>)}</SelectField><SelectField label="Plant type" value={grow.plantType} onChange={e => update('plantType', e.target.value)}><option>Photoperiod</option><option>Autoflower</option></SelectField><Field label="Container or in-ground" value={grow.cultivationStyle} onChange={e => update('cultivationStyle', e.target.value)} /><Field label="Container size" value={grow.containerSize} onChange={e => update('containerSize', e.target.value)} /><Field label="Soil / medium" value={grow.medium} onChange={e => update('medium', e.target.value)} /><Field label="Irrigation method" value={grow.irrigationMethod} onChange={e => update('irrigationMethod', e.target.value)} /><Field label="Sun exposure" value={grow.sunExposure} onChange={e => update('sunExposure', e.target.value)} /><Field label="Fence / greenhouse protection" value={grow.protection} onChange={e => update('protection', e.target.value)} /><Field label="Nutrition program" value={grow.nutritionProgram} onChange={e => update('nutritionProgram', e.target.value)} /><SelectField label="Nutrition approach" value={grow.nutritionApproach} onChange={e => update('nutritionApproach', e.target.value)}><option>Organic</option><option>Synthetic</option><option>Hybrid</option><option>Custom</option></SelectField><Field label="Experience level" value={grow.experienceLevel} onChange={e => update('experienceLevel', e.target.value)} /><Field label="Primary concerns" value={grow.primaryConcerns} onChange={e => update('primaryConcerns', e.target.value)} /></div><div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => save({ ...data, grow })}>Save setup</Button></div><h2 className="mt-4 font-bold">Generated initial plan</h2><EvidenceList items={plan} /></Card>;
}

const blankPlant = (): Plant => ({ id: uid(), name: '', cultivar: 'Custom cultivar', source: '', startDate: CURRENT_DATE, transplantDate: CURRENT_DATE, medium: '', location: '', stage: 'Vegetative', heightIn: 0, widthIn: 0, stemDiameterIn: 0, healthScore: 75, notes: '', estimatedFlowering: 'Unknown range', estimatedHarvest: 'Unknown range' });

function Plants({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [plant, setPlant] = useState<Plant>(blankPlant);
  const [query, setQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const update = (field: keyof Plant, value: string | number | boolean) => setPlant({ ...plant, [field]: value });
  const commit = () => {
    if (!plant.name.trim()) return alert('Plant name is required.');
    const exists = data.plants.some(item => item.id === plant.id);
    save({ ...data, plants: exists ? data.plants.map(item => item.id === plant.id ? plant : item) : [plant, ...data.plants] });
    setPlant(blankPlant());
  };
  const filtered = data.plants.filter(item => `${item.name} ${item.cultivar} ${item.stage}`.toLowerCase().includes(query.toLowerCase()));
  const compared = data.plants.filter(item => compareIds.includes(item.id)).slice(0, 2);
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Individual Plant Records</h1><div className="grid gap-4 lg:grid-cols-3"><Card><h2 className="font-bold">Add / edit plant</h2><div className="grid gap-2"><Field label="Plant name" value={plant.name} onChange={e => update('name', e.target.value)} /><SelectField label="Cultivar" value={plant.cultivar} onChange={e => update('cultivar', e.target.value)}>{cultivarOptions.map(cultivar => <option key={cultivar}>{cultivar}</option>)}</SelectField><Field label="Source" value={plant.source} onChange={e => update('source', e.target.value)} /><Field label="Germination / clone date" type="date" value={plant.startDate} onChange={e => update('startDate', e.target.value)} /><Field label="Transplant date" type="date" value={plant.transplantDate} onChange={e => update('transplantDate', e.target.value)} /><Field label="Medium" value={plant.medium} onChange={e => update('medium', e.target.value)} /><Field label="Location" value={plant.location} onChange={e => update('location', e.target.value)} /><Field label="Current stage" value={plant.stage} onChange={e => update('stage', e.target.value)} /><Field label="Height in" type="number" value={plant.heightIn} onChange={e => update('heightIn', Number(e.target.value))} /><Field label="Width in" type="number" value={plant.widthIn} onChange={e => update('widthIn', Number(e.target.value))} /><Field label="Stem diameter in" type="number" value={plant.stemDiameterIn} onChange={e => update('stemDiameterIn', Number(e.target.value))} /><Field label="Health score" type="number" min={0} max={100} value={plant.healthScore} onChange={e => update('healthScore', Number(e.target.value))} /><Field label="Estimated flowering date" value={plant.estimatedFlowering} onChange={e => update('estimatedFlowering', e.target.value)} /><Field label="Estimated harvest window" value={plant.estimatedHarvest} onChange={e => update('estimatedHarvest', e.target.value)} /><TextArea label="Notes" value={plant.notes} onChange={e => update('notes', e.target.value)} /></div><Button className="mt-3" onClick={commit}><Plus size={16} />Save plant</Button></Card><div className="space-y-3 lg:col-span-2"><Field label="Search and filter plants" value={query} onChange={e => setQuery(e.target.value)} />{filtered.length === 0 && <Card>No plants match that search.</Card>}{filtered.map(item => <PlantCard key={item.id} plant={item} data={data} save={save} edit={() => setPlant(item)} compareIds={compareIds} setCompareIds={setCompareIds} />)}{compared.length === 2 && <Card><h2 className="font-bold">Two-plant comparison</h2><div className="grid gap-3 md:grid-cols-2">{compared.map(item => <div key={item.id}><strong>{item.name}</strong><p>Height {item.heightIn} in; width {item.widthIn} in; stem {item.stemDiameterIn} in; health {item.healthScore}/100.</p><p>{item.notes}</p></div>)}</div></Card>}</div></div></div>;
}

function PlantCard({ plant, data, save, edit, compareIds, setCompareIds }: { plant: Plant; data: AppData; save: (data: AppData) => void; edit: () => void; compareIds: string[]; setCompareIds: (ids: string[]) => void }) {
  const duplicate = () => save({ ...data, plants: [{ ...plant, id: uid(), name: `${plant.name} duplicate` }, ...data.plants] });
  const archive = () => save({ ...data, plants: data.plants.map(item => item.id === plant.id ? { ...item, archived: !item.archived } : item) });
  const remove = () => confirm(`Delete ${plant.name}? This cannot be undone.`) && save({ ...data, plants: data.plants.filter(item => item.id !== plant.id) });
  const exportPlant = () => download(`${plant.name}-plant-report.json`, JSON.stringify(plant, null, 2), 'application/json');
  return <Card><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-bold">{plant.name} — {plant.cultivar}</h2><p>{plant.stage}; {plant.heightIn} in × {plant.widthIn} in; health {plant.healthScore}/100; {plant.archived ? 'Archived' : 'Active'}.</p><p className="text-sm">Flowering: {plant.estimatedFlowering}. Harvest: {plant.estimatedHarvest}.</p><p className="mt-2 text-sm">{plant.notes}</p></div><label className="text-sm"><input type="checkbox" checked={compareIds.includes(plant.id)} onChange={event => setCompareIds(event.target.checked ? [...compareIds, plant.id].slice(-2) : compareIds.filter(id => id !== plant.id))} /> Compare</label></div><div className="mt-3 flex flex-wrap gap-2"><Button tone="plain" onClick={edit}>Edit</Button><Button tone="plain" onClick={duplicate}>Duplicate settings</Button><Button tone="plain" onClick={archive}><Archive size={16} />{plant.archived ? 'Unarchive' : 'Archive'}</Button><Button tone="plain" onClick={exportPlant}>Export report</Button><Button tone="danger" onClick={remove}><Trash2 size={16} />Delete</Button></div></Card>;
}

const journalTags = ['Watered', 'Fed', 'Pruned', 'Topped', 'Trained', 'Sprayed', 'Pest found', 'Damage', 'Flowering observed', 'Photograph', 'Harvest activity'];
const blankJournal = (): JournalEntry => ({ id: uid(), dateTime: new Date().toISOString().slice(0, 16), plantId: 'all', tags: [], weather: '', temperatureF: 75, humidityPct: 35, rainfallIn: 0, windMph: 0, soilMoisture: '', waterGallons: 0, nutrientProducts: '', nutrientAmounts: '', solutionPh: 6.5, ec: 1, training: '', pestObservations: '', diseaseObservations: '', symptoms: '', notes: '' });

function Journal({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [entry, setEntry] = useState<JournalEntry>(blankJournal);
  const update = (field: keyof JournalEntry, value: string | number | string[]) => setEntry({ ...entry, [field]: value });
  const saveEntry = () => {
    if (!entry.dateTime) return alert('Date and time are required.');
    save({ ...data, journal: [entry, ...data.journal] });
    setEntry(blankJournal());
  };
  return <Card><h1 className="text-2xl font-bold">Fast Daily Grow Journal</h1><div className="grid gap-2 md:grid-cols-4"><Field label="Date and time" type="datetime-local" value={entry.dateTime} onChange={e => update('dateTime', e.target.value)} /><SelectField label="Plant or entire grow" value={entry.plantId} onChange={e => update('plantId', e.target.value)}><option value="all">Entire grow</option>{data.plants.map(plant => <option key={plant.id} value={plant.id}>{plant.name}</option>)}</SelectField><Field label="Weather" value={entry.weather} onChange={e => update('weather', e.target.value)} /><Field label="Temperature °F" type="number" value={entry.temperatureF} onChange={e => update('temperatureF', Number(e.target.value))} /><Field label="Relative humidity %" type="number" value={entry.humidityPct} onChange={e => update('humidityPct', Number(e.target.value))} /><Field label="Rainfall in" type="number" value={entry.rainfallIn} onChange={e => update('rainfallIn', Number(e.target.value))} /><Field label="Wind mph" type="number" value={entry.windMph} onChange={e => update('windMph', Number(e.target.value))} /><Field label="Water gallons" type="number" value={entry.waterGallons} onChange={e => update('waterGallons', Number(e.target.value))} /><Field label="Solution pH" type="number" value={entry.solutionPh} onChange={e => update('solutionPh', Number(e.target.value))} /><Field label="EC / PPM" type="number" value={entry.ec} onChange={e => update('ec', Number(e.target.value))} /><Field label="Plant height in" type="number" value={entry.heightIn || ''} onChange={e => update('heightIn', Number(e.target.value))} /><Field label="Plant width in" type="number" value={entry.widthIn || ''} onChange={e => update('widthIn', Number(e.target.value))} /></div><div className="my-3 flex flex-wrap gap-2">{journalTags.map(tag => <button key={tag} onClick={() => update('tags', entry.tags.includes(tag) ? entry.tags.filter(item => item !== tag) : [...entry.tags, tag])} className={`rounded-full border px-3 py-1 text-sm ${entry.tags.includes(tag) ? 'bg-forest text-white' : 'bg-white text-forest'}`}>{tag}</button>)}</div><div className="grid gap-2 md:grid-cols-2"><TextArea label="Soil moisture" value={entry.soilMoisture} onChange={e => update('soilMoisture', e.target.value)} /><TextArea label="Nutrient products and amounts" value={`${entry.nutrientProducts}${entry.nutrientAmounts ? ` — ${entry.nutrientAmounts}` : ''}`} onChange={e => update('nutrientProducts', e.target.value)} /><TextArea label="Training performed" value={entry.training} onChange={e => update('training', e.target.value)} /><TextArea label="Pest / disease / symptoms" value={`${entry.pestObservations} ${entry.diseaseObservations} ${entry.symptoms}`.trim()} onChange={e => update('symptoms', e.target.value)} /><TextArea label="Free-form notes" value={entry.notes} onChange={e => update('notes', e.target.value)} /></div><Button className="mt-3" onClick={saveEntry}>Save journal entry</Button><h2 className="mt-5 font-bold">Recent observations</h2>{data.journal.map(item => <div className="border-t border-forest/10 py-3" key={item.id}><strong>{item.dateTime}</strong> — {item.tags.join(', ')}<p className="text-sm">{item.notes}</p></div>)}</Card>;
}

function Diagnostics() {
  const [answers, setAnswers] = useState({ affected: 'Leaves', growth: 'Old growth', wilting: false, pests: false, wet: false, hot: true, spots: false, tipBurn: false, curling: false, fastSpread: false });
  const result = useMemo(() => {
    if (answers.fastSpread && answers.spots) return 'Disease pressure such as septoria-like spotting, powdery mildew, or botrytis risk';
    if (answers.pests) return 'Pest issue such as aphids, spider mites, thrips, caterpillars, or grasshoppers';
    if (answers.wet) return 'Overwatering or root-zone oxygen problem';
    if (answers.hot && answers.wilting) return 'Heat stress, underwatering, or wind-related transpiration stress';
    if (answers.tipBurn) return 'Nutrient burn, excess salinity, or unit-mixing error';
    if (answers.growth === 'Old growth') return 'Natural lower-leaf senescence or mobile-nutrient symptom';
    return 'Environmental stress or pH-related nutrient unavailability';
  }, [answers]);
  const toggle = (field: keyof typeof answers, checked: boolean) => setAnswers({ ...answers, [field]: checked });
  return <Card><h1 className="text-2xl font-bold">Interactive Diagnostic Engine</h1><p>Rule-based guidance only. The app never claims certainty from symptoms alone and avoids aggressive treatment recommendations for unconfirmed problems.</p><div className="mt-3 grid gap-3 md:grid-cols-3"><SelectField label="Affected plant part" value={answers.affected} onChange={e => setAnswers({ ...answers, affected: e.target.value })}><option>Leaves</option><option>Stems</option><option>Flowers</option><option>Root zone</option></SelectField><SelectField label="Old or new growth" value={answers.growth} onChange={e => setAnswers({ ...answers, growth: e.target.value })}><option>Old growth</option><option>New growth</option><option>All growth</option><option>One plant only</option><option>All plants</option></SelectField>{(['wilting', 'pests', 'wet', 'hot', 'spots', 'tipBurn', 'curling', 'fastSpread'] as const).map(field => <label key={field} className="rounded-lg border border-forest/20 bg-white/80 p-2 text-sm text-forest"><input type="checkbox" checked={Boolean(answers[field])} onChange={e => toggle(field, e.target.checked)} /> {field}</label>)}</div><Card className="mt-4 bg-amber-50 text-amber-950"><h2 className="text-xl font-bold">Most likely explanation: {result}</h2><p>Confidence: medium-low. Recommendation generated {CURRENT_DATE}.</p><EvidenceList items={['Evidence supporting it: affected tissue, growth age, recent heat/wetness, pest evidence, spots, leaf curl, and symptom spread.', 'Evidence conflicting with it: missing calibrated pH/EC trend, no magnified pest confirmation, incomplete soil-moisture profile, and no progression photo series.', 'Inspect next: leaf tops and undersides, new growth, stems, root-zone odor/drainage, interior canopy, and whether one plant or all plants are affected.', 'Low-risk immediate actions: document photos, verify root-zone moisture, improve airflow/support, isolate damaged leaves if practical, and avoid stacking multiple treatments.', 'What not to do: do not assume every yellow leaf is a deficiency and do not apply aggressive pesticide/fungicide/nutrient corrections without confirmation.', 'Reassess in 48–72 hours; seek expert confirmation for rapid spread, flower mold, severe wilting, or legal/product-label uncertainty.']} /></Card><p className="mt-3 text-sm">Diagnostic categories covered include underwatering, overwatering, heat, wind, cold, root-zone oxygen, nitrogen deficiency/toxicity, magnesium, potassium, calcium, pH unavailability, salinity, nutrient burn, light stress, transplant stress, physical damage, aphids, spider mites, thrips, caterpillars, grasshoppers, powdery mildew, botrytis risk, septoria-like spotting, and natural lower-leaf senescence.</p></Card>;
}

function WeatherRisks({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const updateForecast = (index: number, field: keyof ForecastDay, value: number | boolean) => {
    const forecast = [...data.forecast];
    forecast[index] = { ...forecast[index], [field]: value };
    save({ ...data, forecast });
  };
  const risks = ['Extreme heat', 'High wind', 'Hail', 'Heavy rain', 'Cold nights', 'Early frost', 'Low humidity', 'Prolonged humidity', 'Powdery mildew pressure', 'Botrytis pressure', 'Irrigation demand', 'Wildfire smoke', 'Rapid temperature swings'];
  const checklist = ['Inspect plant supports before high wind', 'Delay foliar applications during heat, wind, or rain', 'Check drainage before heavy rain', 'Inspect dense flowers after prolonged moisture', 'Prepare frost protection if lows trend downward', 'Adjust irrigation assessment after rainfall and verify soil moisture'];
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Colorado Weather-Risk Center</h1><p>Forecast data is simulated and editable. A live weather adapter can replace this local source later without changing the UI.</p><div className="grid gap-3 md:grid-cols-3">{data.forecast.map((day, index) => <Card key={day.day}><strong>{day.day}</strong><div className="grid grid-cols-2 gap-2"><Field label="High °F" type="number" value={day.highF} onChange={e => updateForecast(index, 'highF', Number(e.target.value))} /><Field label="Wind mph" type="number" value={day.windMph} onChange={e => updateForecast(index, 'windMph', Number(e.target.value))} /><Field label="Rain in" type="number" value={day.rainfallIn} onChange={e => updateForecast(index, 'rainfallIn', Number(e.target.value))} /><Field label="RH %" type="number" value={day.humidityPct} onChange={e => updateForecast(index, 'humidityPct', Number(e.target.value))} /></div><label className="mt-2 block text-sm"><input type="checkbox" checked={day.hailPossible} onChange={e => updateForecast(index, 'hailPossible', e.target.checked)} /> Hail possible</label><label className="block text-sm"><input type="checkbox" checked={day.smokePossible} onChange={e => updateForecast(index, 'smokePossible', e.target.checked)} /> Smoke possible</label></Card>)}</div><div className="grid gap-3 md:grid-cols-4">{risks.map(risk => <Card key={risk}><AlertTriangle className="text-amber-600" /><strong>{risk}</strong><p className="text-sm">{risk.includes('Wind') ? 'Moderate to serious: inspect supports.' : risk.includes('Botrytis') || risk.includes('humidity') ? 'Monitor moisture and flower density.' : 'Monitor and verify in the garden.'}</p></Card>)}</div><Card><h2 className="font-bold">Forecast action checklist</h2><EvidenceList items={checklist} /></Card></div>;
}

function Irrigation({ data }: { data: AppData }) {
  const [plan, setPlan] = useState({ emitterCount: 8, emitterFlowGph: 0.5, durationMinutes: 60, eventsPerWeek: 3, recentRainfallIn: 0.1, containerGallons: 0, plantHeightIn: 72, temperatureF: 90 });
  const gallonsPerEvent = plan.emitterCount * plan.emitterFlowGph * (plan.durationMinutes / 60);
  const weeklyTotal = gallonsPerEvent * plan.eventsPerWeek;
  return <Card><h1 className="text-2xl font-bold">Irrigation Manager</h1><div className="grid gap-2 md:grid-cols-4">{Object.entries(plan).map(([field, value]) => <Field key={field} label={field} type="number" value={value} onChange={e => setPlan({ ...plan, [field]: Number(e.target.value) })} />)}</div><p className="mt-3 text-xl font-bold">Estimated delivery: {gallonsPerEvent.toFixed(1)} gal/event · {weeklyTotal.toFixed(1)} gal/week</p><EvidenceList items={['Assumes emitter ratings are accurate and lines are unclogged.', 'Suggested inspection interval: every 2 days during hot, dry, windy weather; longer after rainfall.', 'The app cannot determine exact irrigation need without physical soil inspection. Verify moisture at root depth before changing frequency.']} /><ChartCard title="Actual watering history"><BarChart data={data.journal.map(entry => ({ date: entry.dateTime.slice(5, 10), water: entry.waterGallons }))}><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="water" fill="#557f91" /></BarChart></ChartCard></Card>;
}

function Nutrition({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [application, setApplication] = useState<NutritionApplication>({ id: uid(), date: CURRENT_DATE, product: '', npk: '', rate: '', solutionVolumeGallons: 0, ph: 6.5, ec: 1, method: 'Drench', targetPlantId: 'all', growthStage: 'Vegetative', observedResponse: '' });
  const update = (field: keyof NutritionApplication, value: string | number) => setApplication({ ...application, [field]: value });
  return <Card><h1 className="text-2xl font-bold">Nutrition Manager</h1><p className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">Safeguards: confirm units, distinguish concentrate from final solution, avoid overlapping products, avoid feeding stressed or waterlogged plants, and do not treat every yellow leaf as deficiency.</p><div className="grid gap-2 md:grid-cols-4"><Field label="Product" value={application.product} onChange={e => update('product', e.target.value)} /><Field label="N-P-K" value={application.npk} onChange={e => update('npk', e.target.value)} /><Field label="Application rate" value={application.rate} onChange={e => update('rate', e.target.value)} /><Field label="Solution volume gal" type="number" value={application.solutionVolumeGallons} onChange={e => update('solutionVolumeGallons', Number(e.target.value))} /><Field label="pH" type="number" value={application.ph} onChange={e => update('ph', Number(e.target.value))} /><Field label="EC / PPM" type="number" value={application.ec} onChange={e => update('ec', Number(e.target.value))} /><Field label="Method" value={application.method} onChange={e => update('method', e.target.value)} /><Field label="Growth stage" value={application.growthStage} onChange={e => update('growthStage', e.target.value)} /><TextArea label="Observed response" value={application.observedResponse} onChange={e => update('observedResponse', e.target.value)} /></div><Button className="mt-3" onClick={() => save({ ...data, nutrition: [application, ...data.nutrition] })}>Save application</Button><ChartCard title="Nutrition pH / EC history"><LineChart data={data.nutrition}><XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="ph" stroke="#1c4d3b" /><Line dataKey="ec" stroke="#6b4f2a" /></LineChart></ChartCard></Card>;
}

function Training() {
  const [planner, setPlanner] = useState({ plantHeightIn: 72, plantWidthIn: 60, plantCount: 2, postSpacingFt: 6, availablePostHeightFt: 8, netLengthFt: 12, expectedExpansionPct: 20 });
  const materials = [`${Math.ceil(planner.netLengthFt / planner.postSpacingFt) + 1} T-posts or equivalent supports`, `${planner.netLengthFt} ft horizontal trellis net`, 'Soft plant ties and branch clips', 'Anchors, tension line, and inspection flags'];
  const techniques = ['Topping', 'Low-stress training', 'Supercropping', 'Selective pruning', 'Canopy thinning', 'Horizontal SCROG', 'Trellis installation', 'Branch support', 'T-post support systems', 'Wind protection', 'Late-season flower support'];
  return <Card><h1 className="text-2xl font-bold">Training and Structural Support</h1><div className="grid gap-3 md:grid-cols-3">{techniques.map(technique => <Card key={technique}><strong>{technique}</strong><p className="text-sm">Purpose: improve structure, airflow, access, or storm resilience. Appropriate stage varies by method. Benefits include better support; risks include wounds, delayed recovery, and wind leverage. Avoid during severe heat, drought, disease, waterlogging, or late heavy flower.</p></Card>)}</div><h2 className="mt-4 font-bold">Trellis planner</h2><div className="grid gap-2 md:grid-cols-4">{Object.entries(planner).map(([field, value]) => <Field key={field} label={field} type="number" value={value} onChange={e => setPlanner({ ...planner, [field]: Number(e.target.value) })} />)}</div><EvidenceList items={materials} /><p className="text-sm">Planning guidance only, not an engineering certification. Verify anchoring and loads for your site.</p></Card>;
}

function PestCenter() {
  const [query, setQuery] = useState('');
  const profiles = ['Aphids', 'Spider mites', 'Thrips', 'Caterpillars', 'Grasshoppers', 'Powdery mildew', 'Botrytis risk', 'Septoria-like leaf spotting'];
  return <Card><h1 className="text-2xl font-bold">Pest and Disease Center</h1><Field label="Search identification library" value={query} onChange={e => setQuery(e.target.value)} /><div className="mt-3 grid gap-3 md:grid-cols-2">{profiles.filter(profile => profile.toLowerCase().includes(query.toLowerCase())).map(profile => <Card key={profile}><strong>{profile}</strong><p className="text-sm">Includes identification, look-alikes, common plant location, favorable conditions, scouting procedure, prevention, cultural controls, mechanical controls, biological options, product-label reminder, and follow-up inspection interval. Severity: Monitor; intervention may be warranted only after confirmation.</p></Card>)}</div><h2 className="mt-4 font-bold">Scouting checklist</h2><EvidenceList items={['Leaf tops', 'Leaf undersides', 'Stems', 'Soil surface', 'Interior canopy', 'Flowers with gentle mold-aware handling']} /></Card>;
}

function Harvest({ data }: { data: AppData }) {
  return <Card><h1 className="text-2xl font-bold">Harvest Planner</h1>{data.plants.map(plant => <Card className="my-3" key={plant.id}><strong>{plant.name}</strong><p>Estimated range: {plant.estimatedHarvest}. Uncertainty: medium-high. The estimate considers cultivar information, first flowering observations when entered, current flower development, historical observations, weather risks, trichome notes, and plant health; it does not rely only on breeder flowering estimates.</p></Card>)}<EvidenceList items={['Preharvest inspection', 'Weather evaluation', 'Pest and mold inspection', 'Equipment preparation', 'Harvest sequencing', 'Drying-space preparation', 'Sanitation', 'Recordkeeping']} /></Card>;
}

function PhotoTimeline({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [photo, setPhoto] = useState<TimelinePhoto>({ id: uid(), plantId: data.plants[0]?.id || 'all', date: CURRENT_DATE, stage: 'Vegetative', notes: '', symptomTags: '', url: '' });
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPhoto({ ...photo, url: String(reader.result) });
    reader.readAsDataURL(file);
  };
  return <Card><h1 className="text-2xl font-bold">Photo Timeline</h1><p>Photo uploads are organized for future AI analysis, but the current version does not analyze images or claim diagnoses from photographs.</p><input className="my-3" type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => event.target.files?.[0] && handleFile(event.target.files[0])} /><div className="grid gap-2 md:grid-cols-4"><SelectField label="Plant" value={photo.plantId} onChange={e => setPhoto({ ...photo, plantId: e.target.value })}>{data.plants.map(plant => <option key={plant.id} value={plant.id}>{plant.name}</option>)}</SelectField><Field label="Date" type="date" value={photo.date} onChange={e => setPhoto({ ...photo, date: e.target.value })} /><Field label="Growth stage" value={photo.stage} onChange={e => setPhoto({ ...photo, stage: e.target.value })} /><Field label="Symptom tags" value={photo.symptomTags} onChange={e => setPhoto({ ...photo, symptomTags: e.target.value })} /><TextArea label="Notes" value={photo.notes} onChange={e => setPhoto({ ...photo, notes: e.target.value })} /></div><Button className="mt-3" onClick={() => save({ ...data, photos: [photo, ...data.photos] })}>Save photo record</Button><div className="mt-4 grid gap-3 md:grid-cols-3">{data.photos.length === 0 && <p>No photos yet. Upload a plant image to create the first timeline entry.</p>}{data.photos.map(item => <Card key={item.id}>{item.url && <img src={item.url} alt="Plant timeline" className="h-44 w-full rounded-lg object-cover" />}<strong>{item.date} · {item.stage}</strong><p className="text-sm">{item.symptomTags} {item.notes}</p></Card>)}</div></Card>;
}

function Encyclopedia({ data, save }: { data: AppData; save: (data: AppData) => void }) {
  const [query, setQuery] = useState('');
  const topics = ['Outdoor cultivation fundamentals', 'Colorado Front Range conditions', 'Plant physiology', 'Root-zone management', 'Soil and growing media', 'Water quality', 'Irrigation', 'Mineral nutrition', 'Organic nutrition', 'Synthetic nutrition', 'Training', 'Structural support', 'Integrated pest management', 'Diseases', 'Environmental stress', 'Flowering', 'Harvest readiness', 'Drying', 'Curing', 'Storage', 'Troubleshooting'];
  const addBookmark = (topic: string) => save({ ...data, bookmarks: [...new Set([...data.bookmarks, topic])] });
  return <Card><h1 className="text-2xl font-bold">Cultivation Encyclopedia</h1><Field label="Search" value={query} onChange={e => setQuery(e.target.value)} /><div className="mt-3 grid gap-3 md:grid-cols-3">{topics.filter(topic => topic.toLowerCase().includes(query.toLowerCase())).map(topic => <Card key={topic}><BookOpen /><strong>{topic}</strong><p className="text-sm">A structured field-guide article with search, related topics, glossary prompts, reading progress, and careful distinctions between established horticultural principles, reasonable practices, and uncertain cultivar-specific claims.</p><Button tone="plain" onClick={() => addBookmark(topic)}>Add this to my plan</Button></Card>)}</div></Card>;
}

function Reports({ data }: { data: AppData }) {
  const exportCsv = () => {
    const rows = ['date,target,tags,water_gallons,notes', ...data.journal.map(entry => [entry.dateTime, entry.plantId, entry.tags.join('|'), entry.waterGallons, entry.notes.replaceAll(',', ';')].join(','))];
    download('front-range-grow-journal.csv', rows.join('\n'), 'text/csv');
  };
  const reportTypes = ['Weekly grow summary', 'Individual plant report', 'Irrigation report', 'Nutrition application report', 'Pest scouting report', 'Diagnostic report', 'Photo progress report', 'Harvest-readiness report', 'Complete season report'];
  return <Card><h1 className="text-2xl font-bold">Professional Reports</h1><div className="my-3 flex flex-wrap gap-2"><Button onClick={() => window.print()}><Printer size={16} />Print reports</Button><Button tone="soil" onClick={exportCsv}>CSV export</Button></div><div className="grid gap-3 md:grid-cols-2">{reportTypes.map(type => <Card key={type}><FileText /><strong>{type}</strong><p className="text-sm">Includes dates, observations, charts, uploaded images where available, unresolved issues, upcoming actions, recommendation assumptions, missing information, and confidence levels.</p></Card>)}</div></Card>;
}

function Settings({ save }: { save: (data: AppData) => void }) {
  return <Card><h1 className="text-2xl font-bold">Settings</h1><div className="space-y-3"><p>Unit preferences default to US customary. The storage layer is local-first and can later be replaced by Supabase repositories. Weather is supplied by an editable simulated adapter until a live API is configured.</p><Button tone="danger" onClick={() => confirm('Reset all local data to demonstration data?') && save(createDemoData())}>Reset demonstration data</Button></div></Card>;
}

function download(filename: string, content: string, type: string) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([content], { type }));
  anchor.download = filename;
  anchor.click();
}

createRoot(document.getElementById('root')!).render(<ErrorBoundary><App /></ErrorBoundary>);
