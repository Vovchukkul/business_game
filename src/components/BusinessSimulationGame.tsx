import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User } from 'lucide-react';
import emailjs from '@emailjs/browser';

type Option = {
    text: string,
    score: number,
    cost: number,
}

type Scenario = {
    question: string,
    description: string,
    emoji: string,
    options: Option[]
}

const scenarios: Scenario[] = [
  {
    question: '1. Вибір обладнання',
    description: 'Обери стартовий варіант обладнання для виробництва.',
    emoji: '🏭⚙️💸',
    options: [
      { text: 'Нове обладнання (300 000 грн)', score: 15, cost: 300000 },
      { text: 'Вживане обладнання (120 000 грн)', score: 5, cost: 120000 },
      { text: 'Оренда (30 000 грн)', score: 10, cost: 30000 }
    ]
  },
  {
    question: '2. Метод амортизації',
    description: 'Який метод амортизації обереш для бухгалтерії?',
    emoji: '📉📑💡',
    options: [
      { text: 'Прямолінійний — стабільно', score: 10, cost: 0 },
      { text: 'Прискорений — вигідно зараз', score: 12, cost: 0 },
      { text: 'Кумулятивний — більше спишемо на початку', score: 8, cost: 0 },
      { text: 'Виробничий — гнучкий, але потребує точності', score: 10, cost: 0 }
    ]
  },
  {
    question: '3. Обладнання зносилось на 60%',
    description: 'Яке рішення приймеш?',
    emoji: '🧯🔧⚠️',
    options: [
      { text: 'Ремонт (50 000 грн)', score: 14, cost: 50000 },
      { text: 'Ігнорувати проблему', score: -5, cost: 0 },
      { text: 'Купити нове обладнання(300 000 грн)', score: 15, cost: 300000 }
    ]
  },
  {
    question: '4. Розширення: що купуємо?',
    description: 'Обери актив для розширення фірми.',
    emoji: '🛻🏢🚀',
    options: [
      { text: 'Транспорт — швидше доставлятимемо (100 000 грн)', score: 10, cost: 100000 },
      { text: 'Нові машини — більший обсяг (200 000 грн)', score: 15, cost: 200000 },
      { text: 'Будівля — довгострокове інвестування (500 000 грн)', score: 12, cost: 500000 }
    ]
  },
  {
    question: '5. Аналіз ефективності',
    description: 'Як оцінюєш використання основних засобів?',
    emoji: '📊📈🤔',
    options: [
      { text: 'Фондовіддача', score: 10, cost: 0 },
      { text: 'Рентабельність', score: 12, cost: 0 },
      { text: 'Не аналізую', score: -5, cost: 0 }
    ]
  },
  {
    question: '6. Реконструкція чи модернізація?',
    description: 'Основні засоби застаріли. Що робиш?',
    emoji: '🏗️⚙️🔄',
    options: [
      { text: 'Реконструкція (150 000 грн)', score: 10, cost: 150000 },
      { text: 'Модернізація (80 000 грн)', score: 8, cost: 80000 },
      { text: 'Списати й купити нове (300 000 грн)', score: 15, cost: 300000 }
    ]
  },
  {
    question: '7. Джерело фінансування',
    description: 'Обирай джерело коштів для нових основних засобів.',
    emoji: '💰🏦📝',
    options: [
      { text: 'Власні кошти (200 000 грн)', score: 12, cost: 200000 },
      { text: 'Кредит', score: 10, cost: 0 },
      { text: 'Лізинг (100 000 грн)', score: 8, cost: 100000 }
    ]
  },
  {
    question: '8. Потужність виробництва 90%',
    description: 'Що зробити для збільшення потужності?',
    emoji: '🔋🏃‍♂️📦',
    options: [
      { text: 'Придбати нове обладнання (300 000 грн)', score: 15, cost: 300000 },
      { text: 'Упровадити більшу кількість змін роботи(50 000 грн)', score: 14, cost: 50000 },
      { text: 'Відмовитись від нових замовлень', score: -5, cost: 0 }
    ]
  },
  {
    question: '9. Облік основних засобів',
    description: 'Як обліковуватимеш основні засоби?',
    emoji: '📇🧾📚',
    options: [
      { text: 'У натуральному вираженні', score: 8, cost: 0 },
      { text: 'У вартісному вираженні', score: 10, cost: 0 },
      { text: 'Обидва варіанти', score: 12, cost: 0 }
    ]
  },
  {
    question: '10. Ліквідація обладнання',
    description: 'Обладнання повністю зносилось. Що робиш?',
    emoji: '🗑️📉♻️',
    options: [
      { text: 'Продати за залишковою вартістю (+50 000 грн)', score: 10, cost: -50000 },
      { text: 'Здати на металобрухт (+20 000 грн)', score: 8, cost: -20000 },
      { text: 'Нічого не робити', score: -5, cost: 0 }
    ]
  }
];


const Button = ({ children, ...props }: any) => (
  <button
    {...props}
    className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
    style={{marginTop: "10px"}}
  >
    {children}
  </button>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">{children}</div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`space-y-3 ${className || ''}`}>{children}</div>
  );
  
const Input = ({ placeholder, icon, value, onChange }: any) => (
  <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-100">
    {icon && <span className="mr-2 text-gray-700">{icon}</span>}
    <input
      className="bg-transparent outline-none flex-1"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const INITIAL_CAPITAL = 1200000;

export default function BusinessSimulationGame() {
    const [step, setStep] = useState(-1);
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [score, setScore] = useState(0);
    const [capital, setCapital] = useState<number>(INITIAL_CAPITAL);
    const [completed, setCompleted] = useState(false);
    const [showIntro, setShowIntro] = useState(false);
  
    const handleAnswer = (option: { score: number; cost: number }) => {
        const newScore = score + option.score;
        const newCapital = capital - option.cost;
        setScore(newScore);
        setCapital(newCapital);
        const nextStep = step + 1;
        if (nextStep < scenarios.length) {
          setStep(nextStep);
        } else {
          setCompleted(true);
          sendResults(newScore, newCapital);
        }
      };
      const sendResults = async (finalScore: number, finalCapital: number) => {
        try {
          const templateParams = {
            name: userInfo.name,
            email: userInfo.email,
            score: finalScore.toString(),
            capital: finalCapital.toString(),
            to_email: userInfo.email,
            admin_email: 'vovchukkul@gmail.com'
          };
    
          await emailjs.send('service_8t2qy2m', 'template_0em3b01', 
            {
              ...templateParams,
              to_email: `${userInfo.email}`
            }, 'sA3M3ggMlrct6XaTb');
          await emailjs.send('service_8t2qy2m', 'template_0em3b01', {
            ...templateParams,
            to_email: 'vovchukkul@gmail.com'
          }, 'sA3M3ggMlrct6XaTb');
    
          console.log('Обидва листи надіслано успішно!');
        } catch (error) {
          console.error('Помилка надсилання пошти:', error);
        }
      };

  if (step === -1 && !showIntro) {
    return (
      <div className="p-6 max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">Введи свої дані для початку гри</h1>
        <div className="space-y-2">
          <Input
            placeholder="Ім'я та прізвище"
            icon={<User className="w-4 h-4" />}
            value={userInfo.name}
            onChange={(e: { target: { value: any; }; }) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            value={userInfo.email}
            onChange={(e: { target: { value: any; }; }) => setUserInfo({ ...userInfo, email: e.target.value })}
          />
          <Button onClick={() => userInfo.name && userInfo.email && setShowIntro(true)}>Продовжити</Button>
        </div>
      </div>
    );
  }

  if (step === -1 && showIntro) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Постановка задачі</h2>
        <p>Вітаємо, {userInfo.name}! Ти — директор нового виробничого підприємства. Твоє завдання — <b>керувати основними засобами фірми, приймати управлінські рішення та розвивати бізнес.</b></p>
        <ul className="list-disc pl-6">
          <li><strong>Капітал:</strong> 1 000 000 грн</li>
          <li><strong>Репутація:</strong> 0/100</li>
          <li><strong>Знос обладнання:</strong> 0%</li>
          <li><strong>Якість продукції:</strong> 0/100</li>
          <li><strong>Мотивація працівників:</strong> 0/100</li>
          <li><strong>Потужність виробництва:</strong> 0%</li>
        </ul>
        <p className="pt-4 font-medium">Твоя мета — <b>приймати рішення, які покращать ці показники.</b></p>
        <div className="pt-4">
          <table className="w-full text-sm border mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Показник</th>
                <th className="border px-2 py-1">Початкове значення</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border px-2 py-1">Капітал</td><td className="border px-2 py-1">1 000 000 грн</td></tr>
              <tr><td className="border px-2 py-1">Репутація</td><td className="border px-2 py-1">0/100</td></tr>
              <tr><td className="border px-2 py-1">Знос обладнання</td><td className="border px-2 py-1">0%</td></tr>
              <tr><td className="border px-2 py-1">Якість продукції</td><td className="border px-2 py-1">0/100</td></tr>
              <tr><td className="border px-2 py-1">Мотивація працівників</td><td className="border px-2 py-1">0/100</td></tr>
              <tr><td className="border px-2 py-1">Потужність виробництва</td><td className="border px-2 py-1">0%</td></tr>
            </tbody>
          </table>
        </div>
        <div className="text-center pt-6">
          <Button onClick={() => setStep(0)}>Розпочати гру</Button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="p-6 text-center space-y-6">
        <h2 className="text-2xl font-bold">Дякуємо за гру, {userInfo.name}!</h2>
        <p className="text-lg">Ваш загальний результат: {Math.ceil(score/10)} балів</p>
        <div className="pt-4">
          <table className="w-full text-sm border mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Показник</th>
                <th className="border px-2 py-1">Оцінка після гри</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border px-2 py-1">Капітал</td><td className="border px-2 py-1">{(capital + score * 100)} грн</td></tr>
              <tr><td className="border px-2 py-1">Репутація</td><td className="border px-2 py-1">{Math.min(score, 100)}/100</td></tr>
              <tr><td className="border px-2 py-1">Якість продукції</td><td className="border px-2 py-1">{Math.min(score / 1.5, 100).toFixed(0)}/100</td></tr>
              <tr><td className="border px-2 py-1">Мотивація працівників</td><td className="border px-2 py-1">{Math.min(score / 2, 100).toFixed(0)}/100</td></tr>
              <tr><td className="border px-2 py-1">Потужність виробництва</td><td className="border px-2 py-1">{Math.min(score / 2, 100).toFixed(0)}%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const current = scenarios[step];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">{current.question}</h2>
            <p>{current.description}</p>
            <p><i>Ваш поточний капітал:</i> <b>{capital}</b></p>
            <div className="text-4xl pt-2 text-center">
                {step === 0 && '🏭⚙️💸'}
                {step === 1 && '📉📑💡'}
                {step === 2 && '🧯🔧⚠️'}
                {step === 3 && '🛻🏢🚀'}
                {step === 4 && '📊📈🤔'}
                {step === 5 && '🏗️⚙️🔄'}
                {step === 6 && '💰🏦📝'}
                {step === 7 && '🔋🏃‍♂️📦'}
                {step === 8 && '📇🧾📚'}
                {step === 9 && '🗑️📉♻️'}
            </div>
            <div className="space-y-2">
              {current.options.map((opt, index) => (
                <Button key={index} onClick={() => handleAnswer(opt)}>{opt.text}</Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
