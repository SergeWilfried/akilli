'use client';

import { useState } from 'react';
import SimpleProgressBar from '../shared/SimpleProgressBar';
import axios, { AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

interface DragAndDropProps {
  inputRef: any;
  fields: any;
  // task: Task
}
export default function DragAndDrop(props: DragAndDropProps) {
  const { inputRef, fields } = props;
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const dragActive = false; // or false, based on your logic

  function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files['length']; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
        onUploadFile(e.target.files[i]);
      }
    }
  }

  const onUploadFile = async (file) => {
    if (!file) {
      return;
    }

    try {
      const startAt = Date.now();
      const formData = new FormData();
      formData.append('media', file);
      formData.append('fields', fields);

      const options: AxiosRequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: any) => {
          const { loaded, total } = progressEvent;

          // Calculate the progress percentage
          const percentage = (loaded * 100) / total;
          setProgress(+percentage.toFixed(2));

          // Calculate the progress duration
          const timeElapsed = Date.now() - startAt;
          const uploadSpeed = loaded / timeElapsed;
          const duration = (total - loaded) / uploadSpeed;
          setRemaining(duration);
        },
      };

      const {
        data: { data },
      } = await axios.post<{
        data: {
          url: string | string[];
        };
      }>('/api/teams/akilli/upload', formData, options);

      console.log('File was uploaded successfylly:', data);
    } catch (e: any) {
      console.error(e?.response);
      const error =
        e.response && e.response.data
          ? e.response.data.error
          : 'Sorry! something went wrong.';
      toast.error(error);
    }
  };
  function openFileExplorer() {
    inputRef.current.value = '';
    inputRef.current.click();
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  return (
    <div
      className={`${
        dragActive ? 'bg-blue-400' : 'bg-blue-100'
      }  p-4 w-full rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
    >
      {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
      <input
        placeholder="fileInput"
        className="hidden"
        name="files"
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={handleChange}
        accept=".mp3,.wav,.txt"
      />
      {files.length === 0 && (
        <p>
          Drag & Drop files or{' '}
          <span
            className="font-bold text-blue-600 cursor-pointer"
            onClick={openFileExplorer}
          >
            <u>Select files</u>
          </span>{' '}
          to upload
        </p>
      )}

      <div className="flex flex-col items-center p-3">
        {files.map((file: any, idx: any) => (
          <div key={idx} className="flex flex-row space-x-5">
            <span>{file.name}</span>
            <span>
              <SimpleProgressBar progress={progress} remaining={remaining} />
            </span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => removeFile(file.name, idx)}
            >
              remove
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
