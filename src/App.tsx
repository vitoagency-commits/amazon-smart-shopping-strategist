/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Settings, 
  Send, 
  Copy, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  Zap,
  ExternalLink,
  RefreshCw,
  HelpCircle,
  Info,
  Smartphone,
  Tablet,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecommendations } from "./services/geminiService";
import { StrategistResponse, AmazonProduct } from "./types";
import { cn } from "../lib/utils";

export default function App() {
  const [request, setRequest] = useState("");
  const [budget, setBudget] = useState("");
  const [mainUse, setMainUse] = useState("");
  const [associateId, setAssociateId] = useState("vito-21");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<StrategistResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("amazon_associate_id");
    if (savedId) setAssociateId(savedId);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("amazon_associate_id", associateId);
    setIsSettingsOpen(false);
  };

  const handleAnalyze = async () => {
    if (!request.trim()) return;
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      const res = await getRecommendations(request, budget, mainUse, associateId);
      setResponse(res);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err instanceof Error ? err.message : "Si è verificato un errore imprevisto.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setRequest("");
    setBudget("");
    setMainUse("");
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-amazon-light text-amazon-dark font-sans selection:bg-orange-100">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-amazon-dark text-white overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amazon-orange/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="container max-w-4xl px-6 relative z-10 text-center space-y-8 md:space-y-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <Badge className="bg-amazon-orange hover:bg-amazon-orange text-amazon-dark border-none px-4 py-1 text-xs uppercase tracking-widest font-bold">
                  Amazon Associates Elite
                </Badge>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1] uppercase italic">
                  Smart-Shopping <br />
                  <span className="text-amazon-orange not-italic">Strategist</span>
                </h1>
                <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto font-medium">
                  Trasforma ogni richiesta in una vendita. Analisi AI, 3 prodotti vincitori e copy persuasivo per iPhone, iPad e Mac.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left"
              >
                {[
                  { icon: <Award className="text-amazon-orange" />, title: "Trust Building", desc: "Punti deboli onesti per massimizzare la fiducia del cliente." },
                  { icon: <Zap className="text-amazon-orange" />, title: "Conversione Rapida", desc: "3 opzioni chiare per ogni tipo di budget e necessità." },
                  { icon: <Copy className="text-amazon-orange" />, title: "Copy Pronto", desc: "Testi ottimizzati e pronti per WhatsApp, Telegram e Social." }
                ].map((item, i) => (
                  <div key={i} className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="mb-3">{item.icon}</div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <Button 
                  onClick={() => setShowWelcome(false)}
                  size="lg"
                  className="bg-amazon-orange hover:bg-[#e68a00] text-amazon-dark text-lg px-8 md:px-12 py-6 md:py-8 rounded-full shadow-[0_0_40px_rgba(255,153,0,0.3)] transition-all hover:scale-105 active:scale-95 font-bold"
                >
                  Inizia a Guadagnare
                  <Send className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="flex items-center justify-center gap-6 text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold">iPhone</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Tablet className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold">iPad</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Monitor className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold">Mac</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-amazon-orange p-2 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-amazon-dark" />
                  </div>
                  <h1 className="text-lg md:text-xl font-bold tracking-tight">
                    Smart-Shopping <span className="text-amazon-orange">Strategist</span>
                  </h1>
                </div>
                
                <div className="flex items-center gap-1 md:gap-2">
                  <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-amazon-orange">
                        <HelpCircle className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                          <HelpCircle className="w-6 h-6 text-amazon-orange" />
                          Manuale d'Uso
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <section className="space-y-2">
                          <h3 className="font-bold text-lg border-b pb-1">1. Configurazione Iniziale</h3>
                          <p className="text-sm text-gray-600">
                            Per guadagnare commissioni, devi collegare il tuo <strong>Amazon Store ID</strong> (es. <code className="bg-gray-100 px-1 rounded">vito-21</code>). 
                            Vai nelle impostazioni (icona ingranaggio) e inseriscilo. Questo ID verrà aggiunto a tutti i link generati.
                          </p>
                        </section>
                        <section className="space-y-2">
                          <h3 className="font-bold text-lg border-b pb-1">2. Analisi della Richiesta</h3>
                          <p className="text-sm text-gray-600">
                            Inserisci nel campo di testo cosa sta cercando il tuo cliente. Più sei specifico, migliore sarà la selezione dell'AI.
                            Puoi anche indicare un budget e l'uso principale per affinare i risultati.
                          </p>
                        </section>
                        <section className="space-y-2">
                          <h3 className="font-bold text-lg border-b pb-1">3. I 3 Vincitori</h3>
                          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                            <li><strong>BEST-BUY:</strong> Il prodotto con il miglior equilibrio tra recensioni positive e prezzo.</li>
                            <li><strong>PROFESSIONALE:</strong> La scelta top di gamma per chi non accetta compromessi.</li>
                            <li><strong>AFFARE DEL MOMENTO:</strong> L'opzione più economica ma di qualità garantita.</li>
                          </ul>
                        </section>
                        <section className="space-y-2">
                          <h3 className="font-bold text-lg border-b pb-1">4. Copy & Condivisione</h3>
                          <p className="text-sm text-gray-600">
                            Una volta generati i prodotti, clicca su <strong>"Copia Testo Social"</strong>. Otterrai un messaggio formattato professionalmente 
                            da incollare direttamente su WhatsApp, Telegram o Instagram.
                          </p>
                        </section>
                        <section className="space-y-2">
                          <h3 className="font-bold text-lg border-b pb-1">5. Perché il Punto Debole?</h3>
                          <p className="text-sm text-gray-600 italic">
                            Essere onesti su un piccolo difetto (es. "cavo un po' corto") aumenta drasticamente la tua credibilità (Trust) 
                            e spinge l'utente a fidarsi del tuo consiglio, aumentando le probabilità di acquisto.
                          </p>
                        </section>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsManualOpen(false)} className="bg-amazon-orange text-amazon-dark hover:bg-amazon-orange/90">Ho Capito</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-amazon-orange">
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Configurazione Account</DialogTitle>
                        <DialogDescription>
                          Collega il tuo account Amazon Associates per tracciare le vendite.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="associateId">Amazon Store ID (Tracking ID)</Label>
                          <Input 
                            id="associateId" 
                            placeholder="es. vito-21" 
                            value={associateId}
                            onChange={(e) => setAssociateId(e.target.value)}
                            className="focus-visible:ring-amazon-orange"
                          />
                        </div>
                        <Card className="bg-blue-50 border-blue-100">
                          <CardContent className="p-3 flex gap-3 items-start">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-700 leading-relaxed">
                              <strong>È necessario collegare lo Store ID?</strong><br />
                              Sì, se vuoi guadagnare commissioni. Senza il tuo ID, Amazon non saprà che la vendita è merito tuo. 
                              Trovi il tuo ID nella dashboard di Amazon Associates in alto a destra.
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <DialogFooter>
                        <Button onClick={saveSettings} className="bg-amazon-orange text-amazon-dark hover:bg-amazon-orange/90">Salva Modifiche</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl flex-grow">
              <div className="space-y-6 md:space-y-8">
                {/* Input Section */}
                <section>
                  <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-white border-b">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amazon-orange" />
                        Analisi Richiesta Cliente
                      </CardTitle>
                      <CardDescription>
                        Descrivi cosa cerca l'utente per generare le 3 migliori opzioni.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="request">Cosa cerca l'utente?</Label>
                        <Textarea 
                          id="request"
                          placeholder="es. Sto cercando un monitor per il gaming 4K, budget circa 500€..."
                          className="min-h-[100px] md:min-h-[120px] resize-none focus-visible:ring-amazon-orange"
                          value={request}
                          onChange={(e) => setRequest(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget (opzionale)</Label>
                          <Input 
                            id="budget"
                            placeholder="es. 300-500€"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="focus-visible:ring-amazon-orange"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="use">Uso principale (opzionale)</Label>
                          <Input 
                            id="use"
                            placeholder="es. Lavoro d'ufficio, Gaming, Regalo"
                            value={mainUse}
                            onChange={(e) => setMainUse(e.target.value)}
                            className="focus-visible:ring-amazon-orange"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                      <Button variant="ghost" onClick={reset} className="text-gray-500 w-full sm:w-auto">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button 
                        onClick={handleAnalyze} 
                        disabled={loading || !request.trim()}
                        className="bg-amazon-orange hover:bg-amazon-orange/90 text-amazon-dark px-8 shadow-lg shadow-orange-100 transition-all active:scale-95 w-full sm:w-auto font-bold"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.div>
                            Analizzando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Genera Strategia
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </section>

                {/* Error Message */}
                {error && (
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-bold text-red-900 text-sm">Errore di Configurazione</h3>
                        <p className="text-red-800 text-xs leading-relaxed">
                          {error}
                          {error.includes("GEMINI_API_KEY") && (
                            <span className="block mt-2 font-semibold">
                              Assicurati di aver aggiunto la variabile d'ambiente GEMINI_API_KEY nel pannello di controllo di Vercel.
                            </span>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Results Section */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-dashed">
                      <CardHeader>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {response && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                      {response.needsMoreInfo ? (
                        <Card className="border-amazon-orange/20 bg-orange-50">
                          <CardContent className="p-6 flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-amazon-orange shrink-0 mt-1" />
                            <div className="space-y-2">
                              <h3 className="font-bold text-orange-900">Ho bisogno di più dettagli!</h3>
                              <p className="text-orange-800">{response.question}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight">I 3 Vincitori Selezionati</h2>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(response.copyText || "")}
                              className={cn("transition-all w-full sm:w-auto", copied && "bg-green-50 border-green-200 text-green-600")}
                            >
                              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                              {copied ? "Copiato!" : "Copia Testo Social"}
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {response.products?.map((product, idx) => (
                              <div key={idx}>
                                <ProductCard product={product} />
                              </div>
                            ))}
                          </div>

                          <Card className="bg-amazon-dark text-white border-none shadow-xl">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-xs uppercase tracking-widest text-amazon-orange font-bold">
                                Anteprima Copy Persuasivo
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed overflow-x-auto">
                                {response.copyText}
                              </pre>
                            </CardContent>
                            <CardFooter className="border-t border-white/10 pt-4">
                              <p className="text-[10px] md:text-xs text-gray-500 italic">
                                * Ricorda: i prezzi su Amazon variano spesso. Sottolinea l'urgenza se l'utente esita!
                              </p>
                            </CardFooter>
                          </Card>
                        </>
                      )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

            <footer className="py-8 md:py-12 border-t bg-white mt-12 md:mt-20">
              <div className="container mx-auto px-4 text-center space-y-4">
                <p className="text-xs md:text-sm text-gray-500">
                  Strumento professionale per <strong>Amazon Associates & Influencers</strong>.
                </p>
                <div className="flex justify-center gap-4 md:gap-6">
                  <span className="text-[10px] md:text-xs text-gray-400">Commissioni 1-20%</span>
                  <span className="text-[10px] md:text-xs text-gray-400">Conversioni Rapide</span>
                  <span className="text-[10px] md:text-xs text-gray-400">Trust Building</span>
                </div>
              </div>
            </footer>
      </motion.div>
    )}
  </AnimatePresence>
</div>
);
}

function ProductCard({ product }: { product: AmazonProduct }) {
  const getIcon = () => {
    switch (product.type) {
      case "BEST-BUY": return <Award className="w-5 h-5 text-blue-500" />;
      case "PROFESSIONAL": return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case "AFFARE DEL MOMENTO": return <Zap className="w-5 h-5 text-amazon-orange" />;
    }
  };

  const getBadgeColor = () => {
    switch (product.type) {
      case "BEST-BUY": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PROFESSIONAL": return "bg-purple-100 text-purple-700 border-purple-200";
      case "AFFARE DEL MOMENTO": return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-none shadow-md hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className={cn("font-bold text-[10px]", getBadgeColor())}>
              {product.type}
            </Badge>
            {getIcon()}
          </div>
          <CardTitle className="text-sm md:text-base leading-tight font-bold line-clamp-2">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 pt-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Perché comprarlo</p>
            <p className="text-xs md:text-sm text-gray-700 leading-snug">{product.whyBuy}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Punto debole</p>
            <p className="text-xs md:text-sm text-gray-500 italic leading-snug">{product.weakPoint}</p>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button asChild className="w-full bg-amazon-blue hover:bg-amazon-dark text-white font-bold">
            <a href={product.amazonLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              Verifica Prezzo
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
