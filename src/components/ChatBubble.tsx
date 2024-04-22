"use client";
import { decryption, encodeBase64 } from "@/utils/rsa";
import Image from "next/image";

export const TextBubble = ({
  ct,
  isRight,
  user,
  keys,
}: {
  ct: number[];
  isRight: boolean;
  user: string;
  keys: bigint[];
}) => {
  const pt = decryption(ct, keys[1], keys[2]);

  const downloadFile = (resultText: String, fileName: string): void => {
    const link = document.createElement("a");
    const output = [];
    for (let i = 0; i < resultText.length; i++) {
      output.push(resultText.charCodeAt(i));
    }

    const blob = new Blob([new Uint8Array(output)]);
    link.href = URL.createObjectURL(blob);
    // console.log(fileName);

    if (fileName === "") {
      link.download = "result.txt";
    } else {
      link.download = "result_" + fileName;
    }

    link.click();
  };

  return (
    <div
      className={
        isRight
          ? "flex flex-row-reverse w-full h-fit px-6 py-2 gap-3"
          : "flex w-full h-fit px-6 py-2 gap-3"
      }>
      <div id="ProfileIcon" className={isRight ? "hidden" : "profile-bubble"}>
        <Image
          src={user !== "Kim Possible" ? "/kim.jpeg" : "/kanye.jpg"}
          alt="Profile Picture"
          width={200}
          height={200}
        />
      </div>
      <div id="cipher" className="px-4 py-2 divide-y-2 rounded-xl bg-white">
        <div className="pb-2 text-gray-400">
          <button
            type="button"
            onClick={() => downloadFile(encodeBase64(ct), user + "_cipher.txt")}
            className="flex gap-1 items-center hover:text-black hover:underline hover:font-medium">
            <text className="italic">Ciphertext</text>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 22 22">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
              />
            </svg>
          </button>
          <div id="cipher" className="w-fit max-w-xl break-words">
            {encodeBase64(ct)}
          </div>
        </div>
        <div className="pt-2 text-black">
          <button
            type="button"
            onClick={() => downloadFile(pt, user + "_plain.txt")}
            className="flex gap-1 items-center hover:underline">
            <text className="italic font-semibold">Plaintext</text>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 22 22">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
              />
            </svg>
          </button>
          <div id="message">{pt}</div>
        </div>
      </div>
    </div>
  );
};

export const FileBubble = ({
  filename,
  file,
  isRight,
  user,
}: {
  filename: string;
  file: File;
  isRight: boolean;
  user: string;
}) => {
  return (
    <div className={isRight ? "bubble-right" : "bubble-left"}>
      <div id="profile-icon" className={isRight ? "hidden" : "profile-bubble"}>
        <Image
          src={user !== "Kim Possible" ? "/kim.jpeg" : "/kanye.jpg"}
          alt="Profile Picture"
          width={200}
          height={200}
        />
      </div>
      <div
        id="bubble-file"
        className="flex pl-3 py-4 pr-5 gap-2 content-center rounded-xl bg-white">
        <svg
          className="w-12 h-12"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex flex-col pt-0.5">
          <div className="italic font-semibold text-md text-gray-600 max-w-lg break-words">
            {filename}
          </div>
          <div className="flex text-xs text-gray-400 gap-1">
            <button type="button" className="hover:underline">
              Download Plaintext
            </button>
            ∙
            <button type="button" className="hover:underline">
              Download Ciphertext
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
