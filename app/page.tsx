'use client';

import { useState } from 'react';
import { ClipboardIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setLoading(true);
      const res = await fetch('/api/ocr', {
        method: 'POST',
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      setLoading(false);
      setText(data.text || data.error);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main style={{ padding: 20 }}>
      <div className='space-y-4'>

        <h1 className='text-2xl text-center'>
          OCRテスト
        </h1>
        
        <hr/>

        <div className='w-1/3 p-2 mx-auto text-center block bg-sky-500 text-white hover:bg-sky-700 rounded-lg'>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {loading && <p>を読み取り中...</p>}
        </div>
        
        <div className='flex justify-center'>
          <textarea
          className="w-1/2 mx-1 h-screen p-2 text-lg border rounded-lg resize-none block"
          value = {text}
          onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(text);
                alert('コピーしました！');
              }}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
            >
             <ClipboardIcon className='h-6 w-6'/>
            </button>
          </div>
          
        </div>

      </div>
    </main>
  );
}