import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './App.css';

function useDebounceValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

function DisplayPDF({ url }: { url: string }) {
  return (
    <div className="pdf">
      <iframe src={url} width="100%" height="100%" />
    </div>
  );
}

function TemplateChooser({
  templateName,
  setTemplateName,
}: {
  templateName: string;
  setTemplateName: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="template-chooser">
      <img
        onClick={(_) => setTemplateName('template-1')}
        src="/template-1.png"
        alt="template 1"
        className={`${templateName === 'template-1' && 'active'} ${
          templateName.length > 0 && 'selected'
        }`}
      />
      <img
        onClick={(_) => setTemplateName('template-2')}
        src="/template-2.png"
        alt="template 2"
        className={`${templateName === 'template-2' && 'active'} ${
          templateName.length > 0 && 'selected'
        }`}
      />
    </div>
  );
}

function App() {
  const [name, setName] = useState('');
  const nameDebounced = useDebounceValue(name, 500);
  const [aboutMe, setAboutMe] = useState('');
  const aboutMeDebounced = useDebounceValue(aboutMe, 500);
  const [workHistory, setWorkHistory] = useState('');
  const workHistoryDebounced = useDebounceValue(workHistory, 500);
  const [education, setEducation] = useState('');
  const educationDebounced = useDebounceValue(education, 500);
  const [random, setRandom] = useState(Math.random());
  const [templateName, setTemplateName] = useState('');
  useEffect(() => {
    fetch('http://localhost:5000/details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameDebounced,
        aboutMe: aboutMeDebounced,
        workHistory: workHistoryDebounced,
        education: educationDebounced,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((_) => {
        setRandom(Math.random());
      });
  }, [
    nameDebounced,
    aboutMeDebounced,
    workHistoryDebounced,
    educationDebounced,
  ]);
  return (
    <div className="app">
      <TemplateChooser
        setTemplateName={setTemplateName}
        templateName={templateName}
      />
      <div className="parent">
        <div className="form-div">
          <form>
            <input
              type="text"
              placeholder="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="about me"
              name="aboutme"
              rows={5}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
            />
            <textarea
              placeholder="work history"
              name="work"
              rows={5}
              value={workHistory}
              onChange={(e) => setWorkHistory(e.target.value)}
            />
            {templateName === 'template-2' && (
              <textarea
                placeholder="education"
                name="education"
                rows={5}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            )}
          </form>
        </div>
        {templateName && (
          <DisplayPDF
            key={random}
            url={`http://localhost:5000/generate-pdf?template=${templateName}`}
          />
        )}
      </div>
    </div>
  );
}

export default App;
