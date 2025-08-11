import Question from '../models/Question';

interface Answer { questionId: string; chosenIndex: number; }

export async function calculateResultAndCert(answers: Answer[], step: number){
  // naive scoring: fetch question correctIndex and compute %
  const ids = answers.map(a=>a.questionId);
  const questions = await Question.find({_id: {$in: ids}});
  const total = answers.length;
  let correct = 0;
  for(const a of answers){
    const q = questions.find(x=> x._id.toString() === a.questionId);
    if(q && q.correctIndex === a.chosenIndex) correct++;
  }
  const percent = total ? (correct/total)*100 : 0;
  // apply rules per step
  let certificateLevel: string | null = null;
  if(step === 1){
    if(percent < 25) certificateLevel = 'Fail';
    else if(percent < 50) certificateLevel = 'A1';
    else if(percent < 75) certificateLevel = 'A2';
    else certificateLevel = 'A2+Proceed';
  }else if(step ===2){
    if(percent < 25) certificateLevel = 'Remain A2';
    else if(percent < 50) certificateLevel = 'B1';
    else if(percent < 75) certificateLevel = 'B2';
    else certificateLevel = 'B2+Proceed';
  }else{
    if(percent < 25) certificateLevel = 'Remain B2';
    else if(percent < 50) certificateLevel = 'C1';
    else certificateLevel = 'C2';
  }
  return {total,correct,percent,certificateLevel};
}
