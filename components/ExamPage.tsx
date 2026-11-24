import React, { useState, useMemo, useEffect } from "react";
import {
  Award,
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileVideo,
  PlayCircle,
  X,
} from "lucide-react";
import { Course, INITIAL_COURSES } from "./CoursesPage";
import confetti from "canvas-confetti";

// The Questions Bank
const ALL_QUESTIONS = [
  {
    id: "q1",
    type: "MC",
    prompt:
      "Menurut Dr. Robert B. Cialdini, apa pemicu mental yang sering membuat orang bertindak?",
    options: [
      "Kelangkaan (Scarcity) dan Bukti Sosial (Social Proof)",
      "Logika dan Fakta beruntun",
      "Kemudahan fitur aplikasi",
    ],
    correctAnswer: "Kelangkaan (Scarcity) dan Bukti Sosial (Social Proof)",
    courseRec: 6,
    topicName: "Psikologi Penjualan",
  },
  {
    id: "q2",
    type: "MC",
    prompt:
      "Pernyataan mana yang paling tepat mengenai 'The Art of Connection' berdasarkan Daniel Goleman?",
    options: [
      "IQ jauh lebih bernilai dibandingkan kemampuan empati",
      "Kemampuan empati dan membaca situasi sosial lebih berharga daripada IQ",
      "Presentasi produk menentukan keberhasilan pertemuan",
    ],
    correctAnswer:
      "Kemampuan empati dan membaca situasi sosial lebih berharga daripada IQ",
    courseRec: 7,
    topicName: "The Art of Connection",
  },
  {
    id: "q3",
    type: "MC",
    prompt: "Apa kepanjangan dari kerangka kualifikasi prospek 'BANT'?",
    options: [
      "Buyer, Action, Network, Timeline",
      "Budget, Authority, Need, Timeline",
      "Budget, Action, Need, Trust",
    ],
    correctAnswer: "Budget, Authority, Need, Timeline",
    courseRec: 10,
    topicName: "Kualifikasi Prospek (BANT)",
  },
  {
    id: "q4",
    type: "MC",
    prompt:
      "Henry Ford pernah berkata bahwa jika dia bertanya apa yang diinginkan orang, mereka akan menjawab 'kuda yang lebih cepat'. Apa makna kalimat ini dalam konteks 'Masterful Discovery'?",
    options: [
      "Pentingnya menjual kuda sebelum mobil",
      "Klien selalu tahu apa yang mereka mau",
      "Klien sering memberikan gejala, bukan masalah inti yang sebenarnya mereka hadapi",
    ],
    correctAnswer:
      "Klien sering memberikan gejala, bukan masalah inti yang sebenarnya mereka hadapi",
    courseRec: 8,
    topicName: "Masterful Discovery",
  },
  {
    id: "q5",
    type: "MC",
    prompt:
      "Apa kegunaan dari teknik 'Mirroring' dari Chris Voss dalam negosiasi?",
    options: [
      "Meniru bahasa tubuh secara diam-diam",
      "Mengulang 3 kata terakhir klien untuk menurunkan pertahanan ego",
      "Membantah klien dengan menggunakan produk kompetitor",
    ],
    correctAnswer:
      "Mengulang 3 kata terakhir klien untuk menurunkan pertahanan ego",
    courseRec: 7,
    topicName: "Teknik Mirroring",
  },
  {
    id: "q6",
    type: "MC",
    prompt:
      "Sikap apa yang harus diterapkan ketika klien memberikan 'Objection' atau penolakan?",
    options: [
      "Gunakan kerangka validasi agar mereka merasa dimengerti sebelum fakta baru diberikan",
      "Berhentilah membujuk klien saat itu juga",
      "Segera berdebat dengan alasan-alasan logis",
    ],
    correctAnswer:
      "Gunakan kerangka validasi agar mereka merasa dimengerti sebelum fakta baru diberikan",
    courseRec: 9,
    topicName: "Penanganan Penolakan (Objection)",
  },
  {
    id: "q7",
    type: "MC",
    prompt: "Apa makna Hukum 250 dari Joe Girard?",
    options: [
      "Kita hanya perlu menghubungi 250 orang",
      "Setiap orang mengenal 250 orang lain, sehingga pelayanan harus maksimal",
      "Komisi minimum dari transaksi adalah 250 persen",
    ],
    correctAnswer:
      "Setiap orang mengenal 250 orang lain, sehingga pelayanan harus maksimal",
    courseRec: 8,
    topicName: "Membangun Jaringan Relasi",
  },
  {
    id: "q8",
    type: "MC",
    prompt: "Apa esensi dari 'Consultative Selling'?",
    options: [
      "Fokus sepenuhnya pada harga yang ditawarkan",
      "Mengejar transaksi secepat mungkin",
      "Memposisikan diri sebagai penasihat ahli berbasis angka, fakta, dan data",
    ],
    correctAnswer:
      "Memposisikan diri sebagai penasihat ahli berbasis angka, fakta, dan data",
    courseRec: 5,
    topicName: "Consultative Selling",
  },
  {
    id: "q9",
    type: "MC",
    prompt:
      "Klien mengatakan, 'Persentase potongannya terlalu kecil, kompetitor berani memberi lebih.' Bagaimana Anda merespon dengan teknik 'Mirroring'?",
    options: [
      "Mengulang kata: 'Kompetitor memberi lebih?'",
      "Menyerang balik dengan menyebut kualitas produk kita.",
      "Segera meminta manajer untuk memberi diskon ekstra.",
    ],
    correctAnswer: "Mengulang kata: 'Kompetitor memberi lebih?'",
    courseRec: 7,
    topicName: "Teknik Mirroring Lanjutan",
  },
  {
    id: "q10",
    type: "MC",
    prompt:
      "Klien merasa keberatan karena 'Biaya layanannya terlalu mahal.' Pendekatan 3 F (Feel, Felt, Found) yang benar adalah?",
    options: [
      "'Saya mengerti perasaan Anda, klien lain pernah merasa begitu, lalu mereka sadari efisiensinya.'",
      "'Biaya mahal itu relatif, mari lihat fitur kami.'",
      "'Berapa budget Anda yang sebenarnya?'",
    ],
    correctAnswer:
      "'Saya mengerti perasaan Anda, klien lain pernah merasa begitu, lalu mereka sadari efisiensinya.'",
    courseRec: 9,
    topicName: "Teknik Feel, Felt, Found",
  },
  {
    id: "q11",
    type: "MC",
    prompt:
      "Saat calon klien ingin berinvestasi/memainkan dananya, bagaimana Anda bisa menguji elemen 'Authority' (dari BANT)?",
    options: [
      "'Siapa saja pihak yang nantinya akan ikut menentukan persetujuan dari keputusan ini?'",
      "'Apakah Anda sudah siap transfer ke rekening kami sekarang?'",
      "'Berapa lama perusahaan ini sudah berdiri?'",
    ],
    correctAnswer:
      "'Siapa saja pihak yang nantinya akan ikut menentukan persetujuan dari keputusan ini?'",
    courseRec: 10,
    topicName: "Analisis Authority",
  },
  {
    id: "q12",
    type: "MC",
    prompt:
      "Klien menyebut butuh uang untuk biaya kuliah anaknya tahun depan. Memasuki pertemuan selanjutnya, apa tindakan 'Art of Connection' terbaik?",
    options: [
      "Menanyakan persiapan pendaftaran kuliah anak mereka terlebih dahulu.",
      "Pura-pura tidak dengar agar tetap terlihat profesional.",
      "Langsung menembak dengan kalimat: 'Apakah budget Anda sudah ada?'",
    ],
    correctAnswer:
      "Menanyakan persiapan pendaftaran kuliah anak mereka terlebih dahulu.",
    courseRec: 7,
    topicName: "Kepekaan Sosial & Connection",
  },
  {
    id: "q13",
    type: "PREFERENCE",
    prompt:
      "[Gaya Komunikasi] Jika Anda menghadapi prospek yang sangat analitis, pendekatan mana yang paling nyaman bagi Anda?",
    options: [
      "Memberikan data, metrik, dan tabel komparasi detail.",
      "Mengajak diskusi panjang untuk menemukan pola pikir mereka.",
      "Membagikan studi kasus nyata dari klien sebelumnya.",
    ],
    correctAnswer: null, // Any answer is valid
    courseRec: 8,
  },
  {
    id: "q14",
    type: "PREFERENCE",
    prompt:
      "[Resiliensi] Saat menemui penolakan berturut-turut, apa hal utama yang akan Anda lakukan untuk bangkit?",
    options: [
      "Mengevaluasi rekaman presentasi dan mencari tahu detail kesalahannya.",
      "Istirahat sejenak untuk memulihkan energi mental secara utuh.",
      "Meminta roleplay ringan dengan bawahan atau rekan tim.",
    ],
    correctAnswer: null,
    courseRec: 1,
  },
];

// Utility to shuffle an array
function shuffleArray(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface ExamPageProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({ onBack, onComplete }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Pick 8 MC questions and 2 Preference questions
    const mcQuestions = ALL_QUESTIONS.filter((q) => q.type === "MC");
    const prefQuestions = ALL_QUESTIONS.filter((q) => q.type === "PREFERENCE");

    const selectedMC = shuffleArray(mcQuestions).slice(0, 8);
    const selectedPref = shuffleArray(prefQuestions).slice(0, 2);

    let combined = [...selectedMC, ...selectedPref];
    // Shuffle the final list to mix MC and Preference
    combined = shuffleArray(combined);

    // Shuffle options for all questions
    const finalQuestions = combined.map((q) => {
      return { ...q, options: shuffleArray(q.options) };
    });
    setQuestions(finalQuestions);
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let finalCorrect = 0;
    const scoredQuestions = questions.filter((q) => q.type === "MC");
    const weakCourseIds = new Set<number>();

    const processedDetails = questions.map((q) => {
      if (q.type === "MC") {
        const isCorrect = answers[q.id] === q.correctAnswer;
        if (isCorrect) {
          finalCorrect++;
        } else {
          if (q.courseRec) weakCourseIds.add(q.courseRec);
        }
        return {
          questionId: q.id,
          prompt: q.prompt,
          answer: answers[q.id],
          isCorrect,
          idealAnswer: q.correctAnswer,
        };
      } else {
        // Evaluated as purely preference, not scorable
        return {
          questionId: q.id,
          prompt: q.prompt,
          answer: answers[q.id],
          isCorrect: true, // Always visually 'correct' or 'accepted'
          idealAnswer:
            "Pilihan ini mencerminkan preferensi personal Anda yang unik.",
        };
      }
    });

    // Score is calculated only based on MC questions
    const finalScore = Math.floor(
      (finalCorrect / scoredQuestions.length) * 100,
    );

    // Find recommendations based on weak points
    const recommendations = Array.from(weakCourseIds)
      .map((id) => INITIAL_COURSES.find((c) => c.id === id))
      .filter(Boolean);

    // Get correct topics for personalized messaging
    const correctTopics = questions
      .filter(
        (q) =>
          q.type === "MC" && answers[q.id] === q.correctAnswer && q.topicName,
      )
      .map((q) => q.topicName);

    let personalizedMessage = "";
    if (finalScore === 100) {
      const strongTopic =
        correctTopics.length > 0 ? correctTopics[0] : "Teknik Penjualan";
      personalizedMessage = `Skor 100! Kamu benar-benar ahli dalam ${strongTopic}!`;
    } else if (finalScore >= 80) {
      const strongTopic =
        correctTopics.length > 0
          ? correctTopics[Math.floor(Math.random() * correctTopics.length)]
          : "Teknik Penjualan";
      personalizedMessage = `Skor ${finalScore}! Kamu sangat unggul di materi ${strongTopic}, sedikit lagi untuk menjadi ahli!`;
    } else if (finalScore >= 70) {
      personalizedMessage = `Skor ${finalScore}. Kamu lulus, tapi masih ada ruang untuk berkembang. Terus pelajari materi!`;
    } else {
      personalizedMessage = `Skor ${finalScore}. Jangan patah semangat! Pelajari kembali rekomendasi di bawah untuk menutupi kelemahanmu.`;
    }

    setResults({
      score: finalScore,
      correctCount: finalCorrect,
      totalScored: scoredQuestions.length,
      details: processedDetails,
      recommendations,
      personalizedMessage,
    });

    setShowModal(true);

    if (finalScore >= 80) {
      // Trigger generic confetti
      var duration = 3 * 1000;
      var end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [
            "#26ccff",
            "#a25afd",
            "#ff5e7e",
            "#88ff5a",
            "#fcff42",
            "#ffa62d",
            "#ff36ff",
          ],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [
            "#26ccff",
            "#a25afd",
            "#ff5e7e",
            "#88ff5a",
            "#fcff42",
            "#ffa62d",
            "#ff36ff",
          ],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Optional: automatically complete if score is >= 70 when they close the modal
    if (results?.score >= 70) {
      onComplete(results.score);
    }
  };

  if (results && !showModal) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-fade-in pb-20">
        <nav className="sticky top-0 w-full z-50 transition-all duration-500 border-b bg-white/90 backdrop-blur-md backdrop-saturate-150 border-slate-200/60 py-4 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <span className="font-bold text-lg">Exam Results Analysis</span>
            <div className="w-10"></div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mb-8">
            <Award
              className={`w-16 h-16 mx-auto mb-4 ${results.score >= 70 ? "text-amber-500" : "text-slate-400"}`}
            />
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {results.score >= 70
                ? "Congratulations! Mastered."
                : "Keep Trying! Needs Refinement."}
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Score:{" "}
              <span
                className={`font-bold ${results.score >= 70 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {results.score}
              </span>{" "}
              / 100
            </p>
          </div>

          {/* Recommendations Section */}
          {results.recommendations.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold px-2 mb-4">
                Materi yang Perlu Diperdalam
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recommendations.map((course: any) => (
                  <div
                    key={course.id}
                    className="bg-white p-4 rounded-xl border border-indigo-100 flex gap-4 items-center shadow-sm"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${course.imageColor || "bg-indigo-600"}`}
                    >
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-500">{course.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-bold px-2">Detailed Responses</h2>
            {questions.map((q, index) => {
              const result = results.details.find(
                (r: any) => r.questionId === q.id,
              );
              const isPreference = q.type === "PREFERENCE";

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-2xl border ${isPreference ? "bg-indigo-50 border-indigo-200" : result.isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      {isPreference ? (
                        <Award className="w-6 h-6 text-indigo-500" />
                      ) : result.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 mb-4">
                        {index + 1}. {q.prompt}
                      </p>
                      <div className="bg-white/60 rounded-xl p-4 mb-4 border border-slate-200/50">
                        <p className="text-sm font-semibold text-slate-500 mb-1">
                          Your Answer:
                        </p>
                        <p className="text-slate-800 font-medium">
                          {answers[q.id] || (
                            <span className="text-slate-400 italic">
                              No answer provided
                            </span>
                          )}
                        </p>
                      </div>
                      {!result.isCorrect && !isPreference && (
                        <div className="bg-white/60 rounded-xl p-4 border border-slate-200/50">
                          <p className="text-sm font-semibold text-slate-500 mb-1">
                            Correct Answer:
                          </p>
                          <p className="text-slate-800 font-medium">
                            {result.idealAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center pb-20">
            <button
              onClick={() => {
                if (results.score >= 70) onComplete(results.score);
                else onBack();
              }}
              className={`px-8 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-transform ${results.score >= 70 ? "bg-amber-500 text-slate-900" : "bg-slate-900 text-white"}`}
            >
              {results.score >= 70 ? "Claim Certificate" : "Return to Course"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 animate-fade-in relative">
      <nav className="sticky top-0 w-full z-50 transition-all duration-500 border-b bg-white/90 backdrop-blur-md backdrop-saturate-150 border-slate-200/60 py-4 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <span className="font-bold text-lg">Beyond Persuasion Exam</span>
          <div className="w-10"></div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8 pb-32">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-indigo-900 mb-2">
            Certification Assessment
          </h2>
          <p className="text-indigo-700">
            Answer the following 10 questions. Analytical insight and
            personality traits are also measured. You need a score of 70 or
            above on the technical questions to pass.
          </p>
        </div>

        <div className="space-y-8">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm"
            >
              <h3 className="font-bold text-lg mb-6 leading-relaxed">
                <span className="text-slate-400 mr-2">{index + 1}.</span>
                {q.prompt}
              </h3>

              <div className="space-y-3">
                {q.options?.map((opt: string, i: number) => (
                  <label
                    key={i}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${answers[q.id] === opt ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500" : "hover:bg-slate-50 border-slate-200"}`}
                  >
                    <div className="mt-0.5">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleAnswerChange(q.id, opt)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600"
                      />
                    </div>
                    <span className="text-slate-700 font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < 10}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Submit Exam
          </button>
        </div>
      </main>

      {/* EXAM COMPLETE MODAL */}
      {showModal && results && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all">
            <div className="bg-slate-900 p-6 text-center relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black text-white mt-2">
                Exam Complete!
              </h2>
              <p className="text-slate-300 text-sm mt-1">Here is your result</p>
            </div>
            <div className="p-8 text-center bg-slate-50">
              <Award
                className={`w-20 h-20 mx-auto mb-4 ${results.score >= 70 ? "text-amber-500 drop-shadow-md" : "text-slate-400"}`}
              />
              <div className="text-5xl font-black text-slate-900 mb-2">
                {results.score}
              </div>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${results.score >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"} mb-4`}
              >
                {results.score >= 70 ? "PASSED" : "FAILED"}
              </span>

              {results.score >= 80 && (
                <p className="text-emerald-600 font-extrabold text-xl animate-bounce">
                  yeeyy.. congratulations you did it 🎉
                </p>
              )}
            </div>
            <div className="p-6 bg-white border-t border-slate-100">
              {/* Personalized Message */}
              <div
                className={`p-4 rounded-xl text-sm font-medium mb-6 ${results.score >= 70 ? "bg-indigo-50 text-indigo-800 border-l-4 border-indigo-500" : "bg-slate-100 text-slate-700"}`}
              >
                {results.personalizedMessage}
              </div>

              {results.recommendations.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Focus Areas to Improve
                  </h4>
                  <div className="space-y-2">
                    {results.recommendations.slice(0, 3).map((rec: any) => (
                      <div
                        key={rec.id}
                        className="flex items-center gap-3 text-left p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <FileVideo className="w-5 h-5 text-indigo-500 shrink-0" />
                        <span className="font-semibold text-slate-700 text-sm">
                          {rec.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium">
                  Great job! You answered all technical questions correctly.
                </div>
              )}

              <button
                onClick={closeModal}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
              >
                View Detailed Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
