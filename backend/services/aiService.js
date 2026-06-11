import Groq from 'groq-sdk';

const MODEL = 'llama-3.3-70b-versatile';

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeResumeWithAI = async (resumeText) => {
  const prompt = `You are an expert ATS resume analyzer and career coach. Analyze the following resume and provide a detailed JSON response.

Resume Text:
${resumeText}

Respond ONLY with valid JSON in this exact format:
{
  "atsScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "missingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"]
}`;

  const completion = await getGroq().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: MODEL, temperature: 0.3, max_tokens: 1500,
  });
  const text = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
};

export const generateTechnicalInterviewQA = async (role, experience) => {
  const prompt = `You are a senior technical interviewer. Generate 15 technical interview questions with detailed answers for a ${role} position with ${experience} experience.

Respond ONLY with valid JSON:
{
  "questions": [
    { "question": "question text", "answer": "detailed answer", "difficulty": "Easy|Medium|Hard", "category": "category name" }
  ]
}`;

  const completion = await getGroq().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: MODEL, temperature: 0.7, max_tokens: 3000,
  });
  const text = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
};

export const generateHRInterviewQA = async (role, experience) => {
  const prompt = `You are an experienced HR manager. Generate 12 HR/behavioral interview questions with sample answers and tips for a ${role} position with ${experience} experience.

Respond ONLY with valid JSON:
{
  "questions": [
    { "question": "HR question", "answer": "sample answer using STAR method", "tip": "insider tip", "category": "Behavioral|Situational|Cultural Fit|Career Goals" }
  ]
}`;

  const completion = await getGroq().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: MODEL, temperature: 0.7, max_tokens: 3000,
  });
  const text = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
};

export const generateCareerRoadmap = async (currentSkills, targetRole, timeframe) => {
  const prompt = `You are a career mentor. Create a detailed personalized career roadmap.

Current Skills: ${currentSkills.join(', ')}
Target Role: ${targetRole}
Timeframe: ${timeframe}

Respond ONLY with valid JSON:
{
  "summary": "brief overview",
  "phases": [
    {
      "phase": 1, "title": "Phase Title", "duration": "Month 1-2",
      "goals": ["goal1"], "skills": ["skill1"],
      "resources": [{ "title": "resource name", "type": "Course|Book|Project|Practice", "url": "https://example.com" }],
      "milestones": ["milestone1"]
    }
  ],
  "weeklyPlan": { "hoursPerDay": 2, "breakdown": ["activity1 (30 min)"] },
  "keySkillsToLearn": ["skill1", "skill2"],
  "estimatedSalaryRange": "$X - $Y",
  "jobTitles": ["title1", "title2"]
}`;

  const completion = await getGroq().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: MODEL, temperature: 0.6, max_tokens: 3000,
  });
  const text = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
};