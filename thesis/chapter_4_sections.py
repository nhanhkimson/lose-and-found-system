"""Chapter 4 content — layout matches UC1-SE-format.docx (BIT-SE thesis sample)."""

from __future__ import annotations

CHAPTER4_INTRO = (
    "This chapter presents the analysis of data collected from questionnaires, interviews, and "
    "observations conducted at BELTEI International University (BIU). A total of 230 valid "
    "responses were obtained through a structured Google Form distributed between January and "
    "June 2026, supplemented by semi-structured interviews with front-desk and security staff, "
    "direct observation of intake procedures at the student center, and document review of "
    "informal Telegram and Facebook lost-item posts. The analysis focuses on identifying the "
    "strengths and weaknesses of the current lost-and-found management practices and proposes "
    "suitable solutions to address the identified weaknesses through the Digital Lost & Found "
    "System (DLFS). Findings are organized into three sections: strengths (Section 4.1), "
    "weaknesses (Section 4.2), and proposed solutions (Section 4.3). Research hypotheses "
    "derived from this analysis are stated at the end of the chapter for statistical testing "
    "in Chapter 5."
)

SECTION_4_1_INTRO = (
    "The analysis of 230 survey responses reveals that current lost-and-found practices at BIU "
    "possess genuine strengths that should be preserved when implementing DLFS. Although recovery "
    "rates remain low overall, staff support, peer communication, partial record keeping, and "
    "strong user readiness for digital reporting provide a foundation for campus-wide adoption. "
    "The three subsections below examine these strengths with supporting survey percentages, "
    "interview evidence, and interpretation tables."
)

SECTION_4_2_INTRO = (
    "Despite the strengths identified in Section 4.1, the data overwhelmingly indicates that "
    "current practices fail to meet user expectations for recovery speed, search accuracy, claim "
    "accountability, and privacy protection. Weaknesses are examined below in order of severity, "
    "beginning with manual and fragmented processes, followed by poor searchability, and finally "
    "delayed communication with weak claim verification. Each weakness is linked to specific "
    "survey questions and qualitative observations collected during the study period."
)

SECTION_4_3_INTRO = (
    "To address every weakness identified in Section 4.2 while preserving the strengths described "
    "in Section 4.1, this study designed and implemented the Digital Lost & Found System (DLFS). "
    "DLFS is a full-stack platform comprising a Next.js web application, a PostgreSQL database "
    "with Prisma ORM, a documented REST API with OpenAPI specification, and a Flutter mobile "
    "application for iOS and Android—all sharing the same backend deployed at "
    "https://belteiloseandfound.vercel.app. The three subsections below describe the system "
    "implementation, integration and training requirements, and long-term monitoring mechanisms."
)

# Each item: (heading_3_title, paragraphs, table_label_before, table_label_after, headers, rows, closing_paragraph)
STRENGTHS_BLOCKS: list[tuple] = [
    (
        "4.1.1 Effectiveness of the Current Lost and Found Practices",
        [
            "The survey results indicate that the current lost-and-found practices demonstrate a "
            "basic level of effectiveness. Among 230 respondents, 22.6% (52) used the security "
            "office as their primary channel for searching or reporting a lost item (Question 7), "
            "and front-desk staff interviews confirm that personnel remain approachable and willing "
            "to help students who arrive in person. When a student visits the security desk, staff "
            "typically listen to the description, check the handwritten register, and compare the "
            "report against items currently held at the office. In some cases, informal Telegram or "
            "Facebook posts have successfully reunited students with belongings within a few hours, "
            "particularly for high-visibility items such as mobile phones and student ID cards.",
            "Although only 34.8% (80) of respondents successfully recovered their lost item "
            "(Question 8), this partial success reflects existing human support rather than "
            "systematic digital processes. The remaining 65.2% (150) who did not recover their "
            "item reported checking multiple channels without finding a match—evidence that "
            "individual staff effort alone cannot compensate for the absence of a centralized "
            "searchable database. Staff maintain handwritten logs and attempt to match descriptions "
            "against items held at the desk, which meets basic operational needs for walk-in "
            "visitors during office hours.",
            "Question 4 further confirms the scale of the problem that staff must handle manually: "
            "91.3% of respondents experienced at least one lost-item incident in the past year, "
            "including 38.7% (89) who lost items two to three times and 26.5% (60) who lost items "
            "more than three times. Question 6 shows that the most commonly lost items—documents "
            "or ID cards (21.7%), electronics (18.3%), clothing (17.4%), and keys (14.3%)—require "
            "careful description matching, which staff attempt through verbal inquiry and paper "
            "records. This human-centered approach is a genuine strength because it provides "
            "immediate reassurance, but it cannot serve the 68.7% of respondents aged 18–22 who "
            "primarily use smartphones and expect 24-hour digital access.",
            "Interview data from 18 security and front-desk staff respondents (7.8% of the sample, "
            "Question 1) revealed that personnel take pride in returning items to owners and "
            "follow informal verification steps before release. However, they also reported "
            "difficulty when the same item is posted on social media by one student while another "
            "student inquires at the desk with a different description. DLFS is designed to "
            "preserve the accountability role of staff through the admin claims review panel while "
            "extending reach through a searchable online platform accessible from web and mobile.",
        ],
        "Table 4.1.1 Effectiveness of Current Lost and Found Practices",
        "Table 4. Effectiveness of Current Lost and Found Practices",
        ["Aspect Evaluated", "Survey Result", "Interpretation"],
        [
            ("Overall recovery rate", "34.8% recovered (Q8); 65.2% failed", "Basic support exists but recovery rate is critically low"),
            ("Staff willingness to help", "22.6% use security office (Q7); interviews confirm support", "Front-desk is a trusted formal channel"),
            ("Informal channel success", "47.4% use social media (Q7)", "Works for visible cases but is unstructured"),
            ("Lost-item frequency", "91.3% lost ≥1 item in past year (Q4)", "High demand exceeds manual capacity"),
            ("Record keeping", "Partial handwritten logs observed", "Some accountability but not searchable"),
        ],
        "The ability of staff to assist students in person reflects BIU's commitment to campus "
        "service and interpersonal support. However, manual methods limit scalability, prevent "
        "remote access outside office hours, and cannot produce the searchable metadata that "
        "81.3% of respondents demand in Question 13. DLFS complements rather than replaces "
        "front-desk staff by giving them a digital register linked to the same PostgreSQL database "
        "used by students on web and mobile.",
    ),
    (
        "4.1.2 Communication and Awareness Initiatives",
        [
            "Another major strength identified is the active communication culture among BIU "
            "students and staff. Findings show that 47.4% (109) of respondents used social media "
            "as their primary search or report method, while 13.0% (30) relied on friends or "
            "classmates and 22.6% (52) used the security office (Question 7). Campus Telegram "
            "groups, faculty Facebook pages, and class chat channels spread lost-item alerts "
            "within minutes of an incident, reaching audiences that physical notice boards cannot "
            "match. Staff also display printed notices at the student center and front desk for "
            "items held in custody.",
            "This communication energy is particularly strong among the 64.3% (148) student "
            "respondents and across multiple faculties: Information Technology and Science (46.1%), "
            "Business and Economics (19.6%), Education (10.9%), Law and Social Sciences (9.1%), "
            "and Engineering (7.8%) (Question 5). When a student posts a clear photo of a found "
            "wallet or ID card, peers frequently share the post across groups, accelerating "
            "visibility. In successful cases observed during the study, recovery occurred within "
            "the same day because the item was recognizable and the post reached the owner's "
            "classmates directly.",
            "Question 11 provides the strongest evidence of readiness for digital transformation: "
            "84.8% (195) of respondents answered Yes when asked whether they would use a digital "
            "platform to report found items, with only 11.3% (26) answering No and 3.9% (9) "
            "answering Maybe. Question 9 shows that 62.2% rated a Digital Lost & Found platform "
            "4 or 5 on a usefulness scale (mean 3.67 out of 5), indicating that users already "
            "perceive value in centralized reporting even before full campus deployment.",
            "Question 15 ranks the features users expect from such a platform: Photo Upload "
            "(60.9%, 140 respondents), Keyword Search (57.4%), Claim Verification (57.0%), "
            "Location Filtering (55.2%), and Real-time Notifications (53.0%). These preferences "
            "confirm that BIU users want to channel existing communication habits into a structured "
            "system rather than abandon digital sharing altogether. DLFS home page and browse "
            "filters were designed directly from these rankings.",
        ],
        "Table 4.1.2 Communication and Awareness Initiatives",
        "Table 5. Communication and Awareness Initiatives",
        ["Indicator", "Percentage", "Interpretation"],
        [
            ("Use of social media (Q7)", "47.4%", "Fast but unstructured communication"),
            ("Use of security office (Q7)", "22.6%", "Formal channel for walk-in visitors"),
            ("Peer-to-peer sharing (Q7)", "13.0%", "Community-driven but unreliable"),
            ("Perceived platform usefulness (Q9)", "62.2% rated 4–5; mean 3.67/5", "Users expect digital tools to help"),
            ("Willingness to report found items (Q11)", "84.8%", "High readiness for DLFS adoption"),
        ],
        "This demonstrates that BIU users actively share lost-and-found information and are "
        "prepared to adopt a digital platform when it is promoted during orientation, faculty "
        "announcements, and security office referrals. The communication strength of social media "
        "should be redirected into DLFS listings that retain photo visibility while adding "
        "category, building, and date metadata missing from informal posts.",
    ),
    (
        "4.1.3 Monitoring and Reporting Practices",
        [
            "The organization also demonstrates partial strength in monitoring through structured "
            "reporting at the security office. Observations during the study period noted that "
            "staff maintain a paper register recording date received, item description, finder "
            "name, approximate location, and disposition (held at desk, submitted to admin, or "
            "left where found). End-of-week summaries are compiled for internal review, providing "
            "a basic audit trail for high-value items.",
            "Question 6 item-type data aligns with what staff most frequently handle: documents "
            "or ID cards (21.7%, 50 respondents), electronics (18.3%), clothing (17.4%), bags "
            "(14.8%), and keys or access cards (14.3%). These categories map directly to the "
            "ItemCategory enum in the DLFS database schema (DOCUMENTS, ELECTRONICS, CLOTHING, "
            "BAGS, KEYS, and others), confirming that standardized classification reflects real "
            "campus loss patterns. Staff reported that ID cards and keys are the easiest to "
            "return when descriptions match because they are uniquely identifiable.",
            "However, survey data shows that end users lack transparent access to case status. "
            "Question 14 indicates that 79.6% (183) expect a digital claim workflow with proof "
            "submission, staff review, and notification—confirming that internal monitoring exists "
            "but is not visible to students who report or search for items. Question 12 shows "
            "77.8% (179) believe photo upload would help verification, yet paper logs rarely "
            "include images. Question 13 shows 81.3% (187) want searchable online listings, "
            "which paper registers cannot provide.",
            "Administrative staff (9.1%, 21 respondents) and academic staff (18.7%, 43) in the "
            "sample also noted during interviews that they cannot verify whether a student has "
            "already reported an item unless they physically visit the security desk. This "
            "information asymmetry creates duplicate reports and wasted effort. DLFS dashboards "
            "for students and admins close this gap by showing open listings, pending claims, "
            "and resolution history in one interface.",
        ],
        "Table 4.1.3 Monitoring and Reporting Practices",
        "Table 6. Monitoring and Reporting Practices",
        ["Monitoring Practice", "Evidence", "Interpretation"],
        [
            ("Handwritten intake logs", "Observed at security office", "Basic record keeping for found items"),
            ("End-of-week staff summaries", "Reported in interviews", "Internal review only; not student-facing"),
            ("Informal social media posts", "47.4% primary channel (Q7)", "No centralized status tracking"),
            ("Photo evidence in records", "77.8% support upload (Q12)", "Current logs lack visual verification"),
            ("Digital claim workflow demand", "79.6% support (Q14)", "Users expect trackable case status"),
        ],
        "Regular reporting at the front desk promotes partial accountability and demonstrates "
        "management awareness of lost-and-found volume. However, the absence of a searchable "
        "digital record prevents students from checking case progress independently, forces "
        "staff to answer repeated status inquiries, and eliminates the possibility of automated "
        "match suggestions when a new found listing resembles an existing lost report.",
    ),
]

WEAKNESSES_BLOCKS: list[tuple[str, list[str]]] = [
    (
        "4.2.1 Dependence on Manual and Fragmented Processes",
        [
            "Despite its strengths, the current system exhibits significant weaknesses, particularly "
            "its heavy reliance on manual and fragmented channels. Question 7 shows that 47.4% "
            "(109) of respondents used social media, 22.6% (52) the security office, 13.0% (30) "
            "friends or classmates, and 17.0% (39) took no action at all when searching or "
            "reporting a lost item. No single channel holds a complete and current inventory of "
            "lost and found items across campus.",
            "Manual operations are time-consuming and require duplicate posting across group chats "
            "and paper logs, which reduces efficiency and increases administrative workload for "
            "the 18 security and front-desk staff in the sample. Interview findings complement "
            "this result: staff reported that the same item is sometimes posted simultaneously on "
            "Telegram and recorded in the paper log with slightly different descriptions, creating "
            "conflicting records. When a student takes no action (17.0%), the item never enters "
            "any searchable record, eliminating any chance of automated matching or admin review.",
            "Question 4 confirms that 91.3% of respondents experienced at least one lost-item "
            "incident in the past year—38.7% two to three times, 26.5% more than three times, "
            "26.1% once—yet fragmented processes cannot scale to meet this volume. Students in "
            "the IT faculty (46.1% of respondents) frequently lose electronics and access cards "
            "that require fast reporting, but manual channels introduce delays of hours or days "
            "before information reaches the right audience.",
            "This dependence limits scalability and makes it difficult for the organization to "
            "respond quickly when item volume spikes at the start of semesters or during exam "
            "periods. Without a centralized Digital Lost & Found System, BIU cannot guarantee "
            "that a report made on social media is also visible to a student who checks only the "
            "security desk, or vice versa. DLFS addresses fragmentation by providing one "
            "authoritative listing repository accessible from web browsers and the Flutter mobile "
            "application.",
        ],
    ),
    (
        "4.2.2 Poor Searchability and Incomplete Item Details",
        [
            "Search difficulty represents another critical weakness. Question 8 shows that 65.2% "
            "(150) of respondents did not recover their lost item, while only 34.8% (80) "
            "succeeded. This two-to-one failure ratio is the strongest quantitative evidence that "
            "current search methods are inadequate. Question 13 indicates that 81.3% (187) believe "
            "searchable online listings with category, building, and date filters would help—"
            "implicitly confirming that present methods lack these capabilities entirely.",
            "Observations of 40 informal social media posts collected during document analysis "
            "revealed consistent metadata gaps: vague titles such as \"lost wallet\" or \"found "
            "phone,\" missing building or room information, no event date, no standardized "
            "category, and no photo in 60% of posts. Without color, brand, or image fields, "
            "users waste time reviewing irrelevant listings. Question 15 ranks Keyword Search "
            "(57.4%, 132 respondents) and Location Filtering (55.2%, 127) among the top "
            "preferred features, followed by Photo Upload (60.9%) and Claim Verification (57.0%).",
            "Question 6 item-type distribution—documents (21.7%), electronics (18.3%), clothing "
            "(17.4%), bags (14.8%), keys (14.3%)—shows diverse categories that cannot be matched "
            "reliably through free-text social media posts alone. A student searching for a lost "
            "key cannot filter Telegram messages by building or date; they must scroll through "
            "unrelated posts across multiple groups. Security staff face the same problem when "
            "matching walk-in descriptions against paper logs sorted only by arrival date.",
            "Such search inefficiencies pose risks to student satisfaction and financial loss, "
            "particularly for expensive electronics and irreplaceable documents. They also affect "
            "employee trust in campus services: academic staff respondents (18.7%) noted that "
            "they advise students to post on social media because no official searchable system "
            "exists. DLFS browse page implements keyword search (q parameter), filters for type "
            "(LOST/FOUND), category, building, status, and date range, plus similar-item "
            "suggestions on the item detail page.",
        ],
    ),
    (
        "4.2.3 Delayed Communication and Weak Claim Verification",
        [
            "Delayed response and weak verification were reported across interviews and survey data. "
            "There is no formal claim workflow with proof submission, admin review, status "
            "tracking, or automated notification when a case progresses. Ownership disputes at "
            "the security desk are resolved through face-to-face identification and informal "
            "questioning, without systematic proof images, admin notes, or audit timestamps.",
            "Question 14 shows that 79.6% (183) consider a digital claim workflow (submit proof "
            "→ staff review → notification) useful, with only 7.0% (16) answering No and 13.4% "
            "(31) Not sure. Question 15 ranks Claim Verification (57.0%, 131 respondents) among "
            "the top five preferred features, equal in priority to keyword search. Real-time "
            "Notifications (53.0%) were also highly ranked, confirming that users expect timely "
            "updates rather than repeated manual checking.",
            "The lack of real-time notifications forces users to recheck multiple channels "
            "manually—social media groups, the security desk, and peer messages—without knowing "
            "whether a claim was received, approved, or rejected. Privacy concerns add further "
            "friction: Question 10 shows that 75.2% rate privacy protection 4 or 5 on a "
            "five-point scale (mean 4.04), with 46.5% selecting the highest rating. Yet public "
            "social media posts often include phone numbers and full names, exposing students to "
            "spam or misuse. DLFS hides contactName, contactEmail, and contactPhone from public "
            "listings and routes communication through authenticated claim workflows.",
            "DLFS implements Claim records with a minimum 30-character proof message, "
            "proofImageUrls array, PENDING/APPROVED/REJECTED status, adminNote, and reviewedAt "
            "timestamp. Notifications of kind CLAIM, MATCH, ITEM, and SYSTEM inform users through "
            "in-app alerts and Server-Sent Events on web. These features directly respond to the "
            "verification and timeliness weaknesses identified above and align with the Technology "
            "Acceptance Model expectation that perceived usefulness (Q9) and privacy (Q10) drive "
            "adoption.",
        ],
    ),
]

SOLUTION_BLOCKS: list[tuple[str, list[str]]] = [
    (
        "4.3.1 Implementation of a Digital Lost & Found System (DLFS)",
        [
            "To address the identified weaknesses, the implementation of a Digital Lost & Found "
            "System (DLFS) is strongly recommended. Automating item reporting, search, claim "
            "submission, and admin review will significantly reduce manual workload, duplicate "
            "posting, and recovery failure. DLFS provides multi-step Report Lost and Report Found "
            "forms with validated fields for title, description, category (ten enum values), "
            "building, room hint, event date, color, brand, found disposition, and up to five "
            "images per listing.",
            "The web client is built with Next.js 16 App Router, React 19, and TypeScript strict "
            "mode. Server Components render listing pages efficiently; Client Components handle "
            "interactive forms, filters, and notification streams. Key pages include Home, Login, "
            "Register, Browse with search, Item Detail with claim action, User Dashboard with "
            "Recharts analytics, Notifications, Admin Dashboard, Admin Claims Review, and "
            "OpenAPI documentation at /api-docs. Form validation uses Zod schemas with React Hook "
            "Form, ensuring incomplete reports are rejected before reaching the database.",
            "All persistent data is stored in PostgreSQL on Neon, accessed through Prisma ORM. "
            "Core entities are User, Item, Claim, Notification, Account, and Session (Section "
            "3.1.4). Items support type LOST/FOUND, status OPEN/RESOLVED/CLOSED, viewCount "
            "tracking, notifyOnMatch, and allowContact flags. Claims enforce one submission per "
            "user per item. Image files upload to Cloudinary via POST /api/uploads and return "
            "CDN URLs stored in imageUrls and proofImageUrls arrays—addressing the 77.8% photo "
            "upload support found in Question 12.",
            "The Flutter mobile application (beltei_app) provides native iOS and Android access "
            "to the same backend. ItemsRepository, ClaimsRepository, DashboardRepository, "
            "NotificationsRepository, and ProfileRepository call identical REST endpoints as the "
            "web application. Shared constants in lost_found_constants.dart mirror backend enums "
            "and campus building lists. Pagination uses page size 12 on both clients. A student "
            "who reports a found phone on mobile sees the same listing on the web browse page "
            "within seconds because both write to the same Item table through POST /api/items.",
            "An automated system will improve accuracy, efficiency, and consistency in campus "
            "lost-and-found management. Match suggestions on GET /api/items/{id}/similar compare "
            "category and title similarity to connect lost and found listings—a capability "
            "impossible with paper logs or unstructured social media posts.",
        ],
    ),
    (
        "4.3.2 Integration, Training, and Real-Time Reporting",
        [
            "Integrating DLFS with existing campus workflows requires unified authentication, "
            "documented APIs, and staff training. The web application uses NextAuth v5 with "
            "Credentials (email/password) and optional Google OAuth; sessions are stored in "
            "HTTP-only cookies. The mobile client obtains a sessionToken through POST "
            "/api/auth/login, POST /api/auth/register, or POST /api/auth/firebase for Facebook "
            "sign-in on iOS/Android. The token is sent as Authorization: Bearer on all protected "
            "calls; getApiSession() on the server resolves the Prisma User id for ownership and "
            "claims.",
            "The REST API is documented in OpenAPI 3.0.3 and rendered through Swagger UI at "
            "/api-docs. Endpoints cover authentication, items (list, create, detail, update, "
            "similar), claims (list, create), dashboard, profile, notifications (list, mark-read, "
            "SSE stream), and uploads. CORS is enabled (API_CORS_ENABLED=true) so the Flutter app "
            "can call https://belteiloseandfound.vercel.app from iOS and Android without browser "
            "restrictions. This architecture ensures web and mobile remain synchronized without "
            "separate databases or duplicate business logic.",
            "Proper training programs should be conducted for security and front-desk staff "
            "(7.8% of survey respondents, Question 1) on the admin claims review panel, item "
            "lifecycle management (OPEN → RESOLVED → CLOSED), and notification response "
            "procedures. Administrative staff (9.1%) should learn to export dashboard statistics "
            "for monthly reports replacing handwritten summaries. Academic staff (18.7%) can "
            "promote DLFS during class announcements, directing students away from scattered "
            "Telegram posts toward the official platform.",
            "Real-time reporting features address the delayed communication weakness in Section "
            "4.2.3. GET /api/notifications/stream delivers Server-Sent Events on web; mobile "
            "polls GET /api/notifications?limit=50. Users receive alerts when claims are "
            "submitted on their listings, when admins approve or reject with adminNote, and when "
            "potential matches are detected. GET /api/dashboard returns stats (myLost, myFound, "
            "myClaims, myResolved), match suggestions, and recent activity—giving management "
            "up-to-date visibility without waiting for end-of-week paper summaries.",
        ],
    ),
    (
        "4.3.3 System Monitoring, Customization, and Feedback Mechanisms",
        [
            "Regular system monitoring should be conducted to ensure accuracy, data security, and "
            "compliance with BIU privacy expectations (75.2% rate privacy important, Question 10). "
            "Admin dashboards with Recharts visualize items over time, category distribution, and "
            "resolution rates. TanStack Table powers admin views of users, items, and claims with "
            "sorting, filtering, and pagination. Key performance indicators include open case count, "
            "average resolution time, claim approval rate, and listings per faculty.",
            "DLFS should be customized to meet BIU operational needs: campus building filters "
            "matching physical locations, studentId field on registration, role-based access for "
            "STUDENT, STAFF, and ADMIN users, and found-disposition options (STILL_HAVE, "
            "SUBMITTED_SECURITY, LEFT_WHERE_FOUND) reflecting security desk practice observed in "
            "Section 4.1.3. Light and dark theme modes support accessibility preferences identified "
            "in motion graphics evaluation (Questions 16–20, mean scores 4.04–4.18 out of 5).",
            "Establishing a feedback mechanism will allow users to report issues and suggest "
            "improvements, ensuring continuous system enhancement after deployment. Orientation "
            "sessions should target the 84.8% of users willing to report found items digitally "
            "(Question 11), converting survey readiness into active usage. Security office referrals "
            "can direct finders to DLFS instead of handwritten-only intake.",
            "Future customization may include Khmer language support for broader accessibility, "
            "SMS or email alerts through Resend for users who miss in-app notifications, push "
            "notifications on mobile, and integration with campus ID card systems for faster "
            "identity verification during claim approval. Privacy controls will remain central: "
            "contact details stay hidden on public listings until a verified claim is submitted, "
            "and proof images are visible only to item owners and admin reviewers.",
        ],
    ),
]

EXAMINER_SUMMARY = (
    "Examiner-Friendly Summary: The table-based analysis clearly shows that while BIU maintains "
    "acceptable lost-and-found practices through front-desk support (22.6% use security office), "
    "active peer communication (47.4% use social media), and strong digital readiness (84.8% "
    "would report found items online), significant weaknesses remain due to manual processes, a "
    "65.2% recovery failure rate (Question 8), poor searchability (81.3% demand filters in "
    "Question 13), and absent claim tracking (79.6% demand digital workflow in Question 14). "
    "The proposed implementation of DLFS provides a structured and effective solution—unifying "
    "the Next.js web application, PostgreSQL database, REST API documented in OpenAPI, and Flutter "
    "mobile client at belteiloseandfound.vercel.app—to address these weaknesses, improve "
    "operational efficiency, and enhance campus service performance for 230 surveyed stakeholders."
)

HYPOTHESIS_TABLE = {
    "label_before": "Table : Matching Hypotheses with SPSS Test Types",
    "label_after": "Table 7. Hypotheses and Appropriate SPSS Tests",
    "headers": ["Hypothesis", "Variables Involved", "Relationship Type", "SPSS Test"],
    "rows": [
        ("H1", "DLFS implementation & Reporting Accuracy", "Relationship", "Pearson Correlation"),
        ("H2", "DLFS implementation & Search/Recovery Efficiency", "Relationship", "Pearson Correlation"),
        ("H3", "DLFS implementation & Claim Traceability", "Relationship", "Pearson Correlation"),
        ("H4", "DLFS implementation & Communication Timeliness", "Relationship", "Pearson Correlation"),
        ("H5", "DLFS implementation & User Satisfaction", "Relationship", "Pearson Correlation"),
        ("H6", "System Usability & User Acceptance", "Relationship", "Pearson Correlation"),
        ("H7 (Overall)", "DLFS features & Campus service outcomes", "Cause–Effect", "Multiple Linear Regression"),
    ],
}

HYPOTHESES_DETAILED: list[tuple[str, str, str, str]] = [
    (
        "H1: Effect of DLFS on Reporting Accuracy",
        "H1:",
        "The implementation of a Digital Lost & Found System (DLFS) has a significant positive "
        "effect on the accuracy and completeness of lost-and-found reporting.",
        "This hypothesis is supported by findings showing incomplete social media posts during "
        "document analysis and strong respondent agreement that photo upload (77.8%, Question 12) "
        "and structured multi-step forms improve verification. Zod validation on the server rejects "
        "reports missing title, category, building, or eventDate, preventing the vague descriptions "
        "observed in 60% of informal Telegram posts.",
    ),
    (
        "H2: Effect of DLFS on Search and Recovery Efficiency",
        "H2:",
        "The implementation of DLFS significantly improves search and recovery efficiency compared "
        "to manual and fragmented channels.",
        "Survey results indicate that 65.2% failed to recover items (Question 8) and 81.3% support "
        "searchable listings with filters (Question 13). DLFS provides keyword search, category and "
        "building filters, date range queries on GET /api/items, and similar-item suggestions—"
        "directly addressing the Keyword Search (57.4%) and Location Filtering (55.2%) priorities "
        "from Question 15.",
    ),
    (
        "H3: Effect of DLFS on Claim Traceability",
        "H3:",
        "The use of DLFS significantly improves claim traceability and verification accountability.",
        "Question 14 shows 79.6% support for a digital claim workflow with staff review. DLFS "
        "implements proof message (minimum 30 characters), proofImageUrls, PENDING/APPROVED/"
        "REJECTED status, adminNote, reviewedAt, and unique constraint on itemId plus userId—"
        "creating an audit trail absent from face-to-face security desk verification.",
    ),
    (
        "H4: Effect of DLFS on Communication Timeliness",
        "H4:",
        "The implementation of DLFS significantly improves the timeliness of lost-and-found "
        "communication and case updates.",
        "Delayed manual follow-up was a major weakness identified in interviews. DLFS real-time "
        "notifications (53.0% demand, Question 15) use Server-Sent Events on web and in-app alerts "
        "when claim status changes, eliminating the need to recheck Telegram groups or revisit the "
        "security desk for updates.",
    ),
    (
        "H5: Effect of DLFS on User Satisfaction",
        "H5:",
        "The implementation of DLFS has a positive impact on user satisfaction with campus "
        "lost-and-found services.",
        "Question 9 yielded a mean usefulness score of 3.67 out of 5, with 62.2% rating DLFS 4 "
        "or 5. Question 11 shows 84.8% would report found items digitally. Accurate search, "
        "transparent claims, and privacy controls (75.2% rate privacy important, Question 10) are "
        "linked to higher trust in campus services.",
    ),
    (
        "H6: Relationship Between System Usability and User Acceptance",
        "H6:",
        "System usability has a significant positive relationship with user acceptance of DLFS.",
        "Aligned with the Technology Acceptance Model (TAM), motion graphics survey items "
        "(Questions 16–20) yielded mean scores of 4.04–4.18 out of 5, with 43.5%–46.5% strongly "
        "agreeing on navigation, transitions, loading indicators, and icon usability. Polished UI "
        "on web (Tailwind, shadcn/ui) and mobile (Flutter Material) supports perceived ease of use.",
    ),
]

HYPOTHESES_INTRO = (
    "Research Hypotheses\n"
    "Based on the conceptual framework and research objectives of the study \"Build a Digital "
    "Lost & Found System for BELTEI International University\", the following hypotheses are proposed:"
)

HYPOTHESES_CLOSING = (
    "Pearson Correlation Analysis was employed to examine the relationship between the "
    "implementation of the Digital Lost & Found System (DLFS) and outcome variables such as "
    "reporting accuracy, search efficiency, claim traceability, communication timeliness, and "
    "user satisfaction. Multiple Linear Regression Analysis was used to determine the combined "
    "effect of independent variables—including photo upload, keyword search, claim verification, "
    "location filtering, and real-time notifications—on campus lost-and-found service performance "
    "through DLFS. These tests will be applied to post-deployment evaluation data as described "
    "in Chapter 5."
)
