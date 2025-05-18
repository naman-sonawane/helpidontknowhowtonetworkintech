// routes/compareRoutes.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');
const fetch = require('node-fetch');

// Function to compare two profiles and generate insights
async function generateComparison(profile1, profile2) {
  try {
    let prompt = `Compare these two LinkedIn profiles and generate:
1) 4-5 common interests or professional areas they share (for a Venn diagram)
2) 5-6 conversation starters that would be good for them to use when talking to each other, focusing on their shared interests and experiences

Profile 1:
Name: ${profile1.name}
${profile1.rawData?.headline ? `Headline: ${profile1.rawData.headline}` : ''}
${profile1.rawData?.location ? `Location: ${profile1.rawData.location}` : ''}
${profile1.summary ? `Summary: ${profile1.summary}` : ''}
Interests: ${profile1.interests ? profile1.interests.join(', ') : ''}
${profile1.rawData?.education && profile1.rawData.education.length > 0 ? 
  `Education: ${profile1.rawData.education.map(edu => 
    `${edu.school} - ${edu.degree || ''} ${edu.years ? `(${edu.years})` : ''}`
  ).join(', ')}` : ''}
${profile1.rawData?.work_experience && profile1.rawData.work_experience.length > 0 ? 
  `Work Experience: ${profile1.rawData.work_experience.map(work => 
    `${work.title} at ${work.company} ${work.duration ? `(${work.duration})` : ''}`
  ).join(', ')}` : ''}

Profile 2:
Name: ${profile2.name}
${profile2.rawData?.headline ? `Headline: ${profile2.rawData.headline}` : ''}
${profile2.rawData?.location ? `Location: ${profile2.rawData.location}` : ''}
${profile2.summary ? `Summary: ${profile2.summary}` : ''}
Interests: ${profile2.interests ? profile2.interests.join(', ') : ''}
${profile2.rawData?.education && profile2.rawData.education.length > 0 ? 
  `Education: ${profile2.rawData.education.map(edu => 
    `${edu.school} - ${edu.degree || ''} ${edu.years ? `(${edu.years})` : ''}`
  ).join(', ')}` : ''}
${profile2.rawData?.work_experience && profile2.rawData.work_experience.length > 0 ? 
  `Work Experience: ${profile2.rawData.work_experience.map(work => 
    `${work.title} at ${work.company} ${work.duration ? `(${work.duration})` : ''}`
  ).join(', ')}` : ''}

Format your response in JSON like this:
{
  "sharedInterests": [
    {"interest": "interest1", "description": "Brief explanation of how they both share this interest"},
    {"interest": "interest2", "description": "Brief explanation of how they both share this interest"},
    {"interest": "interest3", "description": "Brief explanation of how they both share this interest"},
    {"interest": "interest4", "description": "Brief explanation of how they both share this interest"},
    {"interest": "interest5", "description": "Brief explanation of how they both share this interest"}
  ],
  "conversationTopics": [
    "Detailed conversation starter 1 that references their shared interests or experiences",
    "Detailed conversation starter 2 that references their shared interests or experiences",
    "Detailed conversation starter 3 that references their shared interests or experiences",
    "Detailed conversation starter 4 that references their shared interests or experiences",
    "Detailed conversation starter 5 that references their shared interests or experiences",
    "Detailed conversation starter 6 that references their shared interests or experiences"
  ]
}`;

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
        {interest: "Technology", description: "Both individuals show interest in technology and digital tools"},
        {interest: "Professional Development", description: "Both are focused on career growth and skill building"},
        {interest: "Networking", description: "Both value making professional connections"}
      ],
      conversationTopics: [
        "What recent technology trends have caught your attention lately?",
        "How did you first get started in your current field?",
        "What's a project you're currently excited about working on?",
        "Have you attended any interesting professional events recently?",
        "What skills are you currently focusing on developing?",
        "How do you stay updated with developments in your industry?"
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