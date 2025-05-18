// routes/compareRoutes.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');
const fetch = require('node-fetch');

// Function to compare two profiles and generate insights
async function generateComparison(profile1, profile2) {
  try {
    let prompt = `Compare these two LinkedIn profiles and identify 5 SPECIFIC shared professional elements:

Profile 1:
Name: ${profile1.name}
${profile1.rawData?.headline ? `Headline: ${profile1.rawData.headline}` : ''}
${profile1.summary ? `Summary: ${profile1.summary}` : ''}
Interests: ${profile1.interests ? profile1.interests.join(', ') : ''}
${profile1.rawData?.education && profile1.rawData.education.length > 0 ? 
  `Education: ${profile1.rawData.education.map(edu => 
    `${edu.school} - ${edu.degree || ''}`
  ).join(', ')}` : ''}
${profile1.rawData?.work_experience && profile1.rawData.work_experience.length > 0 ? 
  `Work Experience: ${profile1.rawData.work_experience.map(work => 
    `${work.title} at ${work.company}`
  ).join(', ')}` : ''}

Profile 2:
Name: ${profile2.name}
${profile2.rawData?.headline ? `Headline: ${profile2.rawData.headline}` : ''}
${profile2.summary ? `Summary: ${profile2.summary}` : ''}
Interests: ${profile2.interests ? profile2.interests.join(', ') : ''}
${profile2.rawData?.education && profile2.rawData.education.length > 0 ? 
  `Education: ${profile2.rawData.education.map(edu => 
    `${edu.school} - ${edu.degree || ''}`
  ).join(', ')}` : ''}
${profile2.rawData?.work_experience && profile2.rawData.work_experience.length > 0 ? 
  `Work Experience: ${profile2.rawData.work_experience.map(work => 
    `${work.title} at ${work.company}`
  ).join(', ')}` : ''}

DO NOT USE generic terms like "tech industry," "programming," "leadership," "teamwork," etc.

ONLY identify SPECIFIC shared elements like:
- "Both built AR filters for Instagram"
- "Both used Figma for healthcare UX design"
- "Both spoke at React Toronto 2023"
- "Both implemented GraphQL APIs with Apollo"
- "Both designed embedded systems for Toyota"

Refer to the following example,
Format response as JSON:
{
  "sharedInterests": [
    {"interest": "You both built React Native apps for non-profits"},
    {"interest": "You both implemented WebRTC video conferencing"}
  ],
  "conversationTopics": [
    "How did you optimize React Native performance for older Android devices?",
    "What WebRTC library gave you the best cross-browser compatibility?",
    "Any tools or frameworks you would recommend?",
    "How did you decide on the tech stack for your projects like (project name here)?"
  ]
}

REQUIREMENTS:
1. Each interest MUST name SPECIFIC tools, technologies, projects or events
2. If no SPECIFIC overlap exists, invent NONE - only return what's genuinely shared
3. Never exceed 3 interests if nothing concrete is shared
4. Conversation starters must reference actual shared technical experience about events related to the other person 
5. If you can't find enough SPECIFIC matches, return fewer matches rather than generic ones
6. All sharedInterests MUST begin with "You both"
7. MUST return at least 3-5 shared interests and conversation topics
`

    // Call the AI endpoint
    const response = await fetch('https://ai.hackclub.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`AI API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the content from the AI response
    const aiContent = data.choices[0].message.content;
    
    // Parse the JSON response
    // Find the JSON portion using regex in case there's surrounding text
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Couldn't extract JSON from AI response");
    }
    
    const jsonContent = JSON.parse(jsonMatch[0]);
    
    return jsonContent;
  } catch (error) {
    console.error('Error generating comparison:', error);
    // Fallback with basic comparison if AI fails
    return {
      sharedInterests: [
        {interest: "Full Stack Web Application Architecture", description: "Both design and implement complete web system stacks"},
        {interest: "JavaScript Framework Specialization", description: "Both work extensively with modern JS frameworks"},
        {interest: "Database Design Optimization", description: "Both experienced with optimizing database performance"},
        {interest: "DevOps Pipeline Implementation", description: "Both set up CI/CD workflows for projects"},
        {interest: "API Integration Experience", description: "Both connect systems using RESTful and GraphQL APIs"}
      ],
      conversationTopics: [
        "Which JavaScript framework have you found most reliable for large projects?",
        "What's your approach to database schema design?",
        "How do you handle API authentication in your projects?",
        "What CI/CD tools have you found most effective?",
        "Which recent API integration proved most challenging for you?",
        "How do you approach testing in your development workflow?"
      ]
    };
  }
}

// Compare profiles endpoint
router.post('/compare', async (req, res) => {
  try {
    const { userName, profileId } = req.body;
    
    if (!userName || !profileId) {
      return res.status(400).json({ message: 'Both userName and profileId are required' });
    }
    
    // Find the user's profile by name
    const userProfile = await Profile.findOne({ 
      name: { $regex: new RegExp(userName, 'i') } // Case-insensitive search
    });
    
    // Find the other profile by ID
    const otherProfile = await Profile.findById(profileId);
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    if (!otherProfile) {
      return res.status(404).json({ message: 'Other profile not found' });
    }
    
    // Generate comparison
    const comparison = await generateComparison(userProfile, otherProfile);
    
    // Return the comparison results
    res.json({
      profiles: {
        user: {
          name: userProfile.name,
          headline: userProfile.rawData?.headline || '',
          interests: userProfile.interests || []
        },
        other: {
          name: otherProfile.name,
          headline: otherProfile.rawData?.headline || '',
          interests: otherProfile.interests || []
        }
      },
      comparison
    });
  } catch (error) {
    console.error('Error comparing profiles:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;