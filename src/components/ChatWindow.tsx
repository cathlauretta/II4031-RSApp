"use client";
import Image from "next/image";
import { TextBubble, FileBubble } from "./ChatBubble";
import { useState, useRef, useEffect } from "react";
import { generateKeys, encryption, encodeBase64 } from "@/utils/rsa";

interface Message {
  name: string;
  txt?: number[];
  file?: File;
  filename?: string;
}

const ChatWindow = () => {
  const [keysKanye, setKeysKanye] = useState<bigint[]>([]);
  useEffect(() => {
    const keys: bigint[] = generateKeys();
    setKeysKanye(keys);
  }, []);

  const [keysKim, setKeysKim] = useState<bigint[]>([]);
  useEffect(() => {
    const keys: bigint[] = generateKeys();
    setKeysKim(keys);
  }, []);

  const name1 = "Kim Possible";
  const name2 = "Kanye East";

  const [messages, setMessages] = useState<Message[]>([]);
  const [txtInput1, setTxtInput1] = useState("");
  const [txtInput2, setTxtInput2] = useState("");
  // const [fileInput1, setFileInput1] = useState<File | null>(null);
  // const [fileInput2, setFileInput2] = useState<File | null>(null);

  const handleTxtChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (id === 1) {
      setTxtInput1(e.target.value);
    } else if (id === 2) {
      setTxtInput2(e.target.value);
    }
  };

  const fileInputRef1 = useRef<HTMLInputElement | null>(null);
  const fileInputRef2 = useRef<HTMLInputElement | null>(null);
  const handleFileInputClick = (id: number) => {
    if (id === 1) {
      fileInputRef1.current && fileInputRef1.current.click();
    } else {
      fileInputRef2.current && fileInputRef2.current.click();
    }
  };
  const handleFileSend = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.target.files) {
      const f = e.target.files[0];
      if (f) {
        if (id === 1) {
          const newMsg: Message = {
            name: name1,
            file: f,
            filename: f.name,
          };
          setMessages([...messages, newMsg]);
        } else {
          const newMsg: Message = {
            name: name2,
            file: f,
            filename: f.name,
          };
          setMessages([...messages, newMsg]);
        }
      }
    }
  };

  const handleSend = (id: number) => {
    if (id === 1) {
      const newMsg: Message = {
        name: name1,
        txt: encryption(txtInput1, keysKim[0], keysKim[2]),
      };
      setMessages([...messages, newMsg]);
      setTxtInput1("");
    } else {
      const newMsg: Message = {
        name: name2,
        txt: encryption(txtInput2, keysKanye[0], keysKanye[2]),
      };
      setMessages([...messages, newMsg]);
      setTxtInput2("");
    }
  };

  const downloadKey = (resultText: String, fileName: string): void => {
    const link = document.createElement("a");
    const output = [];
    for (let i = 0; i < resultText.length; i++) {
      output.push(resultText.charCodeAt(i));
    }

    const blob = new Blob([new Uint8Array(output)]);
    link.href = URL.createObjectURL(blob);
    // console.log(fileName);

    if (fileName === "") {
      link.download = "key.txt";
    } else {
      link.download = fileName;
    }

    link.click();
  };

  return (
    <div className="flex h-screen divide-x divide-black">
      <div className="flex flex-col w-full">
        <div
          id="profile-1"
          className="flex w-full h-fit items-center py-4 px-6">
          <div className="profile">
            <Image
              src="/kim.jpeg"
              alt="Profile Picture"
              width={64}
              height={64}
            />
          </div>
          <div className="flex flex-col pl-4">
            <div className="text-xl font-bold">{name1}</div>
            <div className="text-sm italic">
              <text>Online</text>
              <button
                type="button"
                onClick={() => downloadKey(String(keysKim[0]), "*.pub")}
                className="group pl-2">
                <text className="italic invisible group-hover:visible group-hover:text-gray-400">
                  Kim's Pub
                </text>
              </button>
              <button
                type="button"
                onClick={() => downloadKey(String(keysKim[1]), "*.pri")}
                className="group pl-2">
                <text className="italic invisible group-hover:visible group-hover:text-gray-400">
                  Kim's Pri
                </text>
              </button>
            </div>
          </div>
        </div>
        <div
          id="bubble-area1"
          className="flex-1 bg-[url('/sayagata-400px.png')] py-4 overflow-auto scrollbar-hide">
          {messages.map((message) => (
            <>
              {message.txt && (
                <TextBubble
                  isRight={message.name === name1}
                  ct={message.txt}
                  user={message.name}
                  keys={message.name === "Kim Possible" ? keysKim : keysKanye}
                />
              )}
              {message.file && message.filename && (
                <FileBubble
                  isRight={message.name === name1}
                  file={message.file}
                  filename={message.filename}
                  user={message.name}
                />
              )}
            </>
          ))}
        </div>
        <form id="input-area1" className="w-full px-4 py-3 border">
          <div className="flex px-3 py-2 items-center rounded-lg bg-gray-50 ">
            <>
              <button
                type="button"
                onClick={() => handleFileInputClick(1)}
                className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 ">
                <svg
                  className="w-6 h-6 text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"
                  />
                </svg>
                <span className="sr-only">Upload File</span>
              </button>
              <input
                id="files1"
                type="file"
                ref={fileInputRef1}
                onChange={(e) => handleFileSend(e, 1)}
                className="hidden"
              />
            </>
            <input
              id="chat1"
              value={txtInput1}
              onChange={(e) => {
                handleTxtChange(e, 1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(1);
                  e.preventDefault();
                }
              }}
              className="resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Enter a message..."
            />
            <button
              type="button"
              onClick={() => handleSend(1)}
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 ">
              <svg
                className="w-5 h-5 rotate-90 rtl:-rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col w-full">
        <div
          id="profile-2"
          className="flex w-full h-fit items-center py-4 px-6">
          <div className="profile">
            <Image
              src="/kanye.jpg"
              alt="Profile Picture"
              width={64}
              height={64}
            />
          </div>
          <div className="flex flex-col pl-4">
            <div className="text-xl font-bold">{name2}</div>
            <div className="text-sm italic">
              <text>Online</text>
              <button type="button" onClick={() => downloadKey(String(keysKanye[0]), "*.pub")} className="group pl-2">
                <text className="italic invisible group-hover:visible group-hover:text-gray-400">
                  Kanye's Pub
                </text>
              </button>
              <button type="button" onClick={() => downloadKey(String(keysKanye[1]), "*.pri")} className="group pl-2">
                <text className="italic invisible group-hover:visible group-hover:text-gray-400">
                  Kanye's Pri
                </text>
              </button>
            </div>
          </div>
        </div>
        <div
          id="bubble-area2"
          className="flex-1 bg-[url('/sayagata-400px.png')] py-4 overflow-auto scrollbar-hide">
          {messages.map((message) => (
            <>
              {message.txt && (
                <TextBubble
                  isRight={message.name === name2}
                  ct={message.txt}
                  user={message.name}
                  keys={message.name === "Kim Possible" ? keysKim : keysKanye}
                />
              )}
              {message.file && message.filename && (
                <FileBubble
                  isRight={message.name === name2}
                  file={message.file}
                  filename={message.filename}
                  user={message.name}
                />
              )}
            </>
          ))}
        </div>
        <form id="input-area2" className="w-full px-4 py-3 border">
          <div className="flex px-3 py-2 items-center rounded-lg bg-gray-50 ">
            <>
              <button
                type="button"
                onClick={() => handleFileInputClick(2)}
                className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 ">
                <svg
                  className="w-6 h-6 text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"
                  />
                </svg>
                <span className="sr-only">Upload File</span>
              </button>
              <input
                id="files2"
                type="file"
                ref={fileInputRef2}
                onChange={(e) => handleFileSend(e, 2)}
                className="hidden"
              />
            </>
            <input
              id="chat2"
              value={txtInput2}
              onChange={(e) => {
                handleTxtChange(e, 2);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(2);
                  e.preventDefault();
                }
              }}
              className="resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="Enter a message..."
            />
            <button
              type="button"
              onClick={() => handleSend(2)}
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 ">
              <svg
                className="w-5 h-5 rotate-90 rtl:-rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
