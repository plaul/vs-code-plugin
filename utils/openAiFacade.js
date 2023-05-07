const { Configuration, OpenAIApi } = require("openai");

//TODO --> Make a proxy on a server to hide apiKey
const configuration = new Configuration({
  //apiKey: process.env.OPENAI_API_KEY,
  apiKey : "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"
});
const openai = new OpenAIApi(configuration);


async function callOpenAI(f) {

let prompt = `How would you rate the solution to clone an array of strings given after ###### (1 to 5)
If the solution is inefficiet, include a suggestion to fix this
Give it a score x/5 and some pros & cons + a suggestion to what could be done better, in words, not code.
dont include ###### in your response
Your response should include four lines, Score, Pros, Cons and Suggestion
######
`
prompt += f;
console.log(prompt)
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
      // n: 1,
      // stop: null,
      temperature: 0.0,
    });
    console.log(completion.data.choices[0].text)
    return completion.data.choices[0].text;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
  }
}

async function callOpenAI2(func,reply) {

  const prompt = `
Given that a student has written the function given in between #START# and #END# below
and has been requested to explain what he did, as where it the exam.
Provide feedback on his response ,4-5 lines, given in between RES_START and RES_END
Feedback should start with the good things and include a final section with suggestions with a newline to separate the two sections
#START# ${func} #END#  
RES_START ${reply} RES_END`
  
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 250,
        // n: 1,
        // stop: null,
        temperature: 0.0,
      });
      console.log(completion.data.choices[0].text)
      return completion.data.choices[0].text;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
  }

module.exports = {
  callOpenAI,
  callOpenAI2
}
