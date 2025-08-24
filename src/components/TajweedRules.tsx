import React from 'react';

const TajweedRules: React.FC = () => {
  return (
    <div className="mt-4">
      <h5 className="text-xl font-bold">What is tajweed?</h5>
      <p className="mt-2">Tajweed is simply the set of rules governing the way in which the words of the Quran should be pronounced during its recitation. Each rule has been color coded and can be seen at the bottom of each page. Here are simple explanations for what each rule means:</p>
      <ul className="list-disc list-inside mt-4 space-y-4">
        <li>
          Quick Definitions:
          <ul className="list-disc list-inside ml-6 mt-2">
            <li><span className="font-bold">Noon/Meem Saakin</span> - Noon (نْ) or Meem (مْ)  with a Sukoon/Jazm on it</li>
            <li><span className="font-bold">Tanween</span> - the name given in Arabic to the double vocalization at the end of words and whose sound is that of Noon Saakin</li>
          </ul>
        </li>
        <li><span className="font-bold" style={{ color: '#d57c0e' }}>Ghunna</span> - Nasalisation (sound made entirely by the nose) for the letters Noon (ن) and Meem (م) when a shaddah is present. </li>
        <li><span className="font-bold" style={{ color: '#06702d' }}>Idghaam</span> - Idghaam refers to the merging of one letter into the other. The rule  will apply when the letters و م ن ي are preceded by a Noon Saakin or Tanween. The emphasis will be on the second letter and will be read with Ghunna.</li>
        <li><span className="font-bold" style={{ color: '#639620' }}>Idghaam Meem Saakin</span> - If after a Meem Saakin there appears a Meem Mushaddah (مّ), Idghaam will occur. The two Meems will merge and be read with Ghunna (nasalization).</li>
        <li><span className="font-bold" style={{ color: '#068ec6' }}>Ikhfa</span> - If any of the 15 letters of Ikhfa come after a Noon Saakin or Tanween, the word must be read with a light nasal sound in the nose (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك ).</li>
        <li><span className="font-bold" style={{ color: '#d45d86' }}>Ikhfa Meem Saakin</span> - When the letter Ba (ب) appears after a Meem Saakin, it will be pronounced with a light nasal sound in the nose.</li>
        <li><span className="font-bold" style={{ color: '#e04943' }}>Qalqala</span> - When a letter of Qalqala has a sukoon on it, it will be read with an echoing sound (ق ط ب ج د).</li>
        <li><span className="font-bold" style={{ color: '#7a2755' }}>Qalb</span> - When the letter Ba (ب) appears after a Noon Saakin or Tanween, then the Noon Saakin or Tanween will be substituted by a small Meem Saakin and will be recited with Ghunna.</li>
      </ul>
      <p className="mt-4">For more detailed explanations on these rules and more, watch <a href="https://www.youtube.com/playlist?list=PLCHM2Ot8sV_Lm3ZCTrh4DypBqXlaVEUqw" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">these videos on QRC&apos;s YouTube Channel</a></p>
    </div>
  );
};

export default TajweedRules;
