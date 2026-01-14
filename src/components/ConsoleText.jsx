import { useEffect, useState } from "react";

function ConsoleText({ words }) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const interval = setInterval(() => {
      if (letterIndex <= words[wordIndex].length) {
        setText(words[wordIndex].substring(0, letterIndex));
        setLetterIndex(letterIndex + 1);
      } else {
        setTimeout(() => {
          setLetterIndex(0);
          setWordIndex((wordIndex + 1) % words.length);
        }, 1500);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [letterIndex, wordIndex, words]);

  return (
    <div className="console-container">
      <span>{text}</span>
      <span className="console-underscore">_</span>
    </div>
  );
}

export default ConsoleText;
