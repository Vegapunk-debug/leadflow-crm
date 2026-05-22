const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('../models/Lead');
const Discussion = require('../models/Discussion');

dotenv.config({ path: '../.env' });

const today = new Date();
const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

const at = (daysFromToday, hour = 10, minute = 0) => {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() + daysFromToday);
    d.setHours(hour, minute, 0, 0);
    return d;
};

const leads = [
    {
        lead: {
            name: 'Tony Stark',
            company: 'Stark Industries',
            phone: '+1-212-970-4133',
            status: 'Proposal Sent',
            followUp: at(0, 15),
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Cold outreach about our agent platform for Stark R&D. Replied within the hour — "JARVIS could use a younger sibling".', createdAt: at(-21), followUp: null },
            { note: 'Discovery call. Sharp questions on uptime, on-prem deployment, and whether we can fine-tune on proprietary schematics.', createdAt: at(-14), followUp: null },
            { note: 'Technical deep-dive with their engineering team. Pepper Potts looped in for procurement.', createdAt: at(-6), followUp: null },
            { note: 'Sent enterprise proposal with custom SLA + dedicated solutions engineer. Final call today at 3pm.', createdAt: at(-2), followUp: at(0, 15) },
        ],
    },
    {
        lead: {
            name: 'Steve Rogers',
            company: 'S.H.I.E.L.D. Veteran Outreach',
            phone: '+1-718-555-0107',
            status: 'Qualified',
            followUp: at(3),
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Referred by Nick Fury. Needs agents for veteran reintegration program — case routing + benefits Q&A.', createdAt: at(-10), followUp: null },
            { note: 'Demo call. Loved the workflow builder. Budget approved through Q3.', createdAt: at(-4), followUp: null },
            { note: 'Sent ROI calculator + govt-sector case studies. Follow-up Friday.', createdAt: at(-1), followUp: at(3) },
        ],
    },
    {
        lead: {
            name: 'Bruce Banner',
            company: 'Banner Research Labs',
            phone: '+1-617-555-0188',
            status: 'Contacted',
            followUp: null,
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Inbound from website. Researching LLM tooling for protein-folding pipelines.', createdAt: at(-5), followUp: null },
            { note: 'First call. Technically deep but unsure on budget — said "the other guy handles money". Sent docs.', createdAt: at(-2), followUp: null },
        ],
    },
    {
        lead: {
            name: 'Peter Parker',
            company: 'Parker Industries',
            phone: '+1-718-555-0199',
            status: 'Contacted',
            followUp: at(-2),
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Cold outreach. Young founder building neighborhood-watch tech, friendly tone.', createdAt: at(-8), followUp: null },
            { note: 'Discovery call. Eager but scattered — mentioned his "aunt" twice. Said he\'d circle back Monday.', createdAt: at(-4), followUp: at(-2) },
        ],
    },
    {
        lead: {
            name: 'Natasha Romanoff',
            company: 'S.H.I.E.L.D. Special Operations',
            phone: '+1-202-555-0173',
            status: 'New',
            followUp: null,
            assignedTo: 'default_user',
        },
        discussions: [],
    },
    {
        lead: {
            name: 'Carol Danvers',
            company: 'S.W.O.R.D.',
            phone: '+1-202-555-0144',
            status: 'New',
            followUp: at(2),
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Just signed up for trial. Needs onboarding call — likely a high-velocity user.', createdAt: at(0, 4), followUp: at(2) },
        ],
    },
    {
        lead: {
            name: 'Wanda Maximoff',
            company: 'Westview Innovations',
            phone: '+1-201-555-0166',
            status: 'Qualified',
            followUp: at(-5),
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Inbound. Building some kind of "simulation" platform — vague on specifics.', createdAt: at(-12), followUp: null },
            { note: 'Demo went well. Asked for a 30-day trial with white-label branding.', createdAt: at(-8), followUp: null },
            { note: 'Committed to follow up by end of week. Seemed distracted on the last call.', createdAt: at(-5), followUp: at(-5) },
        ],
    },
    {
        lead: {
            name: 'Thor Odinson',
            company: 'Asgardian Trade Office',
            phone: '+47-22-555-0190',
            status: 'Won',
            followUp: null,
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Outreach via his brother Loki (on our partner team — long story).', createdAt: at(-30), followUp: null },
            { note: 'Demo. Declared the platform "most worthy". Contract sent same day.', createdAt: at(-20), followUp: null },
            { note: 'Signed. Annual plan, 50 seats. Kickoff scheduled with their ops team.', createdAt: at(-10), followUp: null },
        ],
    },
    {
        lead: {
            name: 'Stephen Strange',
            company: 'Kamar-Taj Consulting',
            phone: '+977-1-555-0111',
            status: 'Lost',
            followUp: null,
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Reached out via LinkedIn. Curious about agent orchestration for "non-traditional workflows".', createdAt: at(-25), followUp: null },
            { note: 'Discovery call. Said he had "seen 14,000,605 futures" and we weren\'t the right fit in any of them.', createdAt: at(-15), followUp: null },
            { note: 'Politely declined. Suggested we revisit "after the next incursion".', createdAt: at(-5), followUp: null },
        ],
    },
    {
        lead: {
            name: 'T\'Challa Udaku',
            company: 'Wakanda Design Group',
            phone: '+27-11-555-0142',
            status: 'Proposal Sent',
            followUp: at(0, 17),
            assignedTo: 'default_user',
        },
        discussions: [
            { note: 'Inbound via Wakandan trade delegation. Looking for agent tooling to scale outreach programs.', createdAt: at(-18), followUp: null },
            { note: 'Demo with Princess Shuri. She called our API "adequate" — high praise apparently.', createdAt: at(-12), followUp: null },
            { note: 'Sent custom proposal. Vibranium-grade encryption requirements added per their security review.', createdAt: at(-4), followUp: at(0, 17) },
        ],
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const existingLeads = await Lead.countDocuments();
        if (existingLeads > 0) {
            console.log('Database already seeded. Skipping...');
            await mongoose.disconnect();
            process.exit(0);
        }

        for (const { lead, discussions } of leads) {
            const createdLead = await Lead.create(lead);

            if (discussions.length > 0) {
                const sorted = [...discussions].sort((a, b) => a.createdAt - b.createdAt);
                await Discussion.insertMany(
                    sorted.map(d => ({
                        lead: createdLead._id,
                        note: d.note,
                        followUp: d.followUp || null,
                        createdAt: d.createdAt,
                        updatedAt: d.createdAt,
                    }))
                );
            }
            console.log(`Seeded ${createdLead.name} with ${discussions.length} discussion(s)`);
        }

        console.log('Database seeded successfully!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seedDB();