import { useState, useCallback, useRef } from "react";

export function useChatSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const finalizedRef = useRef("");
  const supported = useRef(false);

  // Lazily init recognition
  const getRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return null;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    supported.current = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t + " ";
        else interim += t;
      }
      if (final) {
        finalizedRef.current = (finalizedRef.current + final).trim() + " ";
        setTranscript(finalizedRef.current);
      } else if (interim) {
        const base = finalizedRef.current.trim();
        setTranscript(base ? base + " " + interim : interim);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return recognition;
  }, []);

  const toggleListening = useCallback(() => {
    const recognition = getRecognition();
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      finalizedRef.current = "";
      setTranscript("");
      const tryStart = (retries = 3) => {
        try {
          recognition.start();
          setIsListening(true);
        } catch {
          if (retries > 0) setTimeout(() => tryStart(retries - 1), 150);
        }
      };
      tryStart();
    }
  }, [isListening, getRecognition]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    finalizedRef.current = "";
  }, []);

  return {
    isListening,
    transcript,
    toggleListening,
    clearTranscript,
    supported: supported.current || ("webkitSpeechRecognition" in window || "SpeechRecognition" in window),
  };
}
