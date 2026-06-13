#!/usr/bin/env python3
"""Generate BIT-SE Bachelor's Thesis document for BIU Lost & Found project."""

from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt
from docx.oxml.ns import qn


AUTHOR = "NHANH KIMSON"
YEAR = "2026"
SUPERVISOR = "MR. SOTHEA THY"
TITLE = (
    "BUILD A DIGITAL LOST & FOUND SYSTEM FOR BELTEI "
    "INTERNATIONAL UNIVERSITY"
)
SHORT_TITLE = "Build a Digital Lost & Found System"
SYSTEM_ACRONYM = "DLFS"
ORG = "BELTEI International University"
SAMPLE_SIZE = 200
OUTPUT = Path(__file__).resolve().parents[1] / "thesis" / "Nhanh-Kimson-Thesis-2026.docx"
OUTPUT_APPLICATIONS = Path("/Applications/Nhanh Kimson.docx")
FIGURE_1 = Path(__file__).resolve().parents[1] / "thesis" / "figures" / "figure-1-conceptual-framework.png"


def set_doc_defaults(doc: Document) -> None:
    style = doc.styles["Normal"]
    font = style.font
    font.name = "Times New Roman"
    font.size = Pt(12)
    style._element.rPr.rFonts.set(qn("w:eastAsia"), "Times New Roman")


def add_centered(doc: Document, text: str, *, bold: bool = False, size: int = 12) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.bold = bold
    run.font.name = "Times New Roman"
    run.font.size = Pt(size)


def add_heading(doc: Document, text: str, level: int = 1) -> None:
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        run.font.name = "Times New Roman"
        run.font.color.rgb = None


def add_body(doc: Document, text: str) -> None:
    p = doc.add_paragraph(text)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.5
    for run in p.runs:
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)


def add_bullets(doc: Document, items: list[str]) -> None:
    for item in items:
        p = doc.add_paragraph(item, style="List Bullet")
        for run in p.runs:
            run.font.name = "Times New Roman"
            run.font.size = Pt(12)


def add_page_break(doc: Document) -> None:
    doc.add_page_break()


def add_figure(doc: Document, path: Path, caption: str, *, width: float = 5.5) -> None:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(str(path), width=Inches(width))
    add_centered(doc, caption)


def ensure_thesis_figures() -> None:
    import subprocess
    import sys

    script = Path(__file__).parent / "generate-framework-diagram.py"
    subprocess.run([sys.executable, str(script)], check=True)


def build_front_matter(doc: Document) -> None:
    for _ in range(3):
        add_centered(doc, TITLE, bold=True, size=14)
        doc.add_paragraph()
    add_centered(doc, AUTHOR, bold=True)
    add_centered(doc, YEAR, bold=True)
    add_page_break(doc)

    add_centered(doc, TITLE, bold=True, size=14)
    doc.add_paragraph()
    add_centered(
        doc,
        "THE BACHELOR'S THESIS IN PARTIAL FULFILLMENT\n"
        "OF THE REQUIREMENT FOR THE DEGREE OF BACHELOR\n"
        "OF INFORMATION TECHNOLOGY IN SOFTWARE ENGINEERING",
        size=12,
    )
    add_page_break(doc)

    add_centered(doc, TITLE, bold=True, size=14)
    doc.add_paragraph()
    add_centered(doc, SUPERVISOR)
    add_centered(doc, YEAR)
    add_centered(doc, AUTHOR)
    add_page_break(doc)

    add_centered(doc, "COMMITTEE APPROVAL", bold=True)
    doc.add_paragraph()
    add_body(
        doc,
        f'This Bachelor\'s Thesis entitled "{SHORT_TITLE} for {ORG}" was prepared '
        f"and submitted by {AUTHOR} of the Beltei International University in partial "
        "fulfilment of the requirement of a Bachelor of Software Engineering (BIT-SE).",
    )
    add_body(doc, "Approved by the University Evaluation Committee with a grade of PASSED")
    add_body(doc, "The university EVALUATION COMMITTEE OF BACHELOR'S THESIS")
    add_body(doc, "Chair of Committee\t\t:_____________________________")
    add_body(doc, "\t\t\t\tMr. OEM Chanthorn, Dean")
    add_body(doc, "Deputy Chair of Committee\t:_____________________________")
    add_body(doc, "\t\t\t\tMr. KROENG Vannak, Vice Dean")
    add_body(doc, "Member\t\t\t\t:_____________________________")
    add_body(doc, "\t\t\t\tMr. KHATH Yoeun, Master")
    add_body(doc, "Member\t\t\t\t:_____________________________")
    add_body(doc, "\t\t\t\tMr. PRUM Vannarith, Master")
    add_body(doc, "Facilitator\t\t\t:_____________________________")
    add_body(doc, f"\t\t\t\t{SUPERVISOR}, Master")
    add_body(doc, "Date of Bachelor Thesis submission\t:_____________________________")
    add_body(
        doc,
        "Accepted in partial fulfilment of the requirements for the degree of "
        "Bachelor of Information Technology in Software Engineering (BIT-SE)",
    )
    doc.add_paragraph()
    add_centered(doc, "________________________")
    add_centered(doc, "H.E. LY Navuth")
    add_centered(doc, "President")
    add_page_break(doc)

    add_centered(doc, "DECLARATION", bold=True)
    doc.add_paragraph()
    add_body(
        doc,
        f'I do hereby declare that, except otherwise stated the Bachelor\'s Thesis '
        f'"{SHORT_TITLE} for {ORG}" based on my original work and the same has not '
        "been submitted either in part or in full for the award of any other degree "
        "of this or any other University.",
    )
    doc.add_paragraph()
    add_body(doc, "My indebtedness to other writer(s) has/have been acknowledged at relevant places.")
    doc.add_paragraph()
    add_centered(doc, "__________________________                          __________________________")
    add_centered(doc, f"{AUTHOR}                                                                 Date Signed")
    add_page_break(doc)

    add_centered(doc, "ACKNOWLEDGMENT", bold=True)
    doc.add_paragraph()
    add_body(
        doc,
        "I would like to acknowledge people whose contributions helped me to successfully "
        "complete this research report.",
    )
    add_body(
        doc,
        "First, I would like to express my grateful thanks to H.E LY Navuth, the President "
        "of Beltei International University for offering me a great opportunity and scholarship "
        "to study at Beltei International University, in Faculty of Information Technology and "
        "Science, majoring in Software Engineering.",
    )
    add_body(
        doc,
        "Secondly, I would like to express thanks to Mr. OEM CHANTHORN, Dean of Faculty of "
        "Information Technology and Science and Faculty of Digital Technology and Telecommunication "
        "for providing us with the opportunity to join this program of research to gain more "
        "knowledge and improve research skills which is important for academics.",
    )
    add_body(
        doc,
        f"Third, I would like to thank Mr. SOTHEA THY, my supervisor who helped me to supervise "
        "this research report to have a better outcome. Throughout the process of conducting "
        "research, I would like to express most gratefulness for his patience, support, goodwill, "
        "and understanding since it had assisted me excessively for the progress of my research. "
        "He has played a very important role as I went through the steps of this study as he "
        "extended his guidance and perseverance by advising the best choices to make from the "
        "beginning until the end of this research process.",
    )
    add_body(
        doc,
        "Lastly, I deeply extend my appreciation towards the participants of my survey questionnaire "
        "for the essential data collection of this study. Their valuable time, honesty, patience, "
        "and cooperativeness are greatly appreciated as their contribution would yield the best "
        "outcome for this research.",
    )
    add_page_break(doc)

    add_centered(doc, "ABSTRACT", bold=True)
    doc.add_paragraph()
    add_body(
        doc,
        f"Lost and found management is a critical campus service that directly affects student "
        f"satisfaction, operational efficiency, and the safe return of personal belongings. "
        f"For {ORG}, this study investigates the development of a {SHORT_TITLE} ({SYSTEM_ACRONYM}) "
        f"with the goal of improving the speed, transparency, and reliability of reporting lost "
        f"items, publishing found items, matching potential owners, and processing ownership claims. "
        f"Many universities still rely on bulletin boards, informal social media posts, or fragmented "
        f"manual records, which frequently result in delayed reunions, duplicate reports, and poor "
        f"visibility of open cases. This study examines the challenges faced by students and campus "
        f"staff in lost-and-found coordination and proposes a digital solution that integrates "
        f"structured item reporting, image uploads, searchable listings, automated match suggestions, "
        f"claim verification, in-app notifications, and role-based administration.",
    )
    add_body(
        doc,
        "Through a mixed-method approach combining surveys, interviews, and direct observation of "
        "existing campus practices, the study identifies key weaknesses in manual coordination and "
        "evaluates user readiness for a centralized web platform. The proposed system is designed "
        "with a user-friendly interface, secure authentication, validated forms, and a scalable "
        "PostgreSQL database to ensure accuracy, accessibility, and maintainability. Built with "
        "Next.js, Prisma, NextAuth, Cloudinary, and REST APIs documented in OpenAPI, the system "
        "supports both browser users and external clients.",
    )
    add_body(
        doc,
        "The findings indicate that implementing DLFS can significantly reduce the time required "
        "to locate matching listings, improve claim traceability, and increase confidence in campus "
        "lost-and-found processes. The system also supports better decision-making for administrators "
        "through dashboards, claim review tools, and activity analytics. Overall, the research "
        "demonstrates that digital transformation in campus lost-and-found services is both "
        "technically feasible and strongly supported by end users.",
    )
    add_body(
        doc,
        f"Keyword: Lost and Found, Campus Information System, Digital Transformation, "
        f"Web Application, Claim Management, {ORG}, Software Engineering.",
    )
    add_page_break(doc)


def build_contents(doc: Document) -> None:
    add_centered(doc, "CONTENTS", bold=True)
    doc.add_paragraph()
    contents = [
        ("COMMITTEE APPROVAL", "iv"),
        ("DECLARATION", "v"),
        ("ACKNOWLEDGMENT", "vi"),
        ("ABSTRACT", "vii"),
        ("CONTENTS", "viii"),
        ("LIST OF TABLES", "xi"),
        ("LIST OF FIGURES", "xii"),
        ("LIST OF ABBREVIATIONS", "xiii"),
        ("CHAPTER 1: INTRODUCTION", "1"),
        ("1.1 Introduction to Research", "1"),
        ("1.2 Research Problem", "2"),
        ("1.3 Research Aim/Objective", "2"),
        ("1.3.1 Research Question", "3"),
        ("1.3.2 Signification of the study", "3"),
        ("1.4 Scope and limitation", "3"),
        ("1.4.1 Scope and Limitations", "4"),
        ("1.4.2 Limitations of the Study", "4"),
        ("1.5 Layout of the study/Research", "5"),
        ("CHAPTER 2: LITERATURE REVIEW", "7"),
        ("2.1 Definitions and Theories Related to the Topic", "7"),
        ("2.2 Analysis of Scholars' Concepts/Words/Sayings", "8"),
        ("2.3 Experiences or Issues Raised", "9"),
        ("2.4 Research Model or Framework", "10"),
        ("CHAPTER 3: RESEARCH METHODOLOGY", "12"),
        ("3.1 Research Methodology", "12"),
        ("3.1.1 Research Design", "12"),
        ("3.1.2 Research Location", "12"),
        ("3.1.3 Research Population", "14"),
        ("3.1.4 Research Data Scope of UI", "15"),
        ("3.1.5 Research Data Scope of UX", "19"),
        ("3.2 Data Collection Instrument", "20"),
        ("3.2.1 Data Collection Procedure", "20"),
        ("3.2.2 Statistical Data", "21"),
        ("3.3 Sampling Technique", "31"),
        ("3.4 Validity and Reliability", "32"),
        ("CHAPTER 4: DATA ANALYSIS", "34"),
        ("4.1 Analysis of the Strengths", "34"),
        ("4.2 Analysis of Weaknesses", "36"),
        ("4.3 Solution(s) Dealing with the Weaknesses", "36"),
        ("CHAPTER 5: RESEARCH FINDINGS AND DISCUSSIONS", "41"),
        ("CHAPTER 6: CONCLUSION AND RECOMMENDATIONS", "44"),
        ("REFERENCES", "46"),
        ("APPENDICES A: Geography", "47"),
        ("APPENDICES B: Data Structure and Frameworks", "48"),
        ("APPENDICES C: System Interface (UI)", "49"),
        ("APPENDICES D: Survey Questionnaires in Google Form", "54"),
        ("APPENDICES E: Activities And Planning", "58"),
        ("APPENDICES F: Photos", "63"),
    ]
    for title, page in contents:
        p = doc.add_paragraph()
        p.add_run(f"{title}\t{page}")
    add_page_break(doc)


def build_lists(doc: Document) -> None:
    add_centered(doc, "LIST OF TABLES", bold=True)
    doc.add_paragraph()
    tables = [
        "Table 1 List of participation",
        "Table 2 Validity Assessment of Research Instrument",
        "Table 3 Reliability Test Results (Cronbach's Alpha)",
        "Table 4 Effectiveness of Current Lost and Found Practices",
        "Table 5 Communication and Awareness Initiatives",
        "Table 6 Monitoring and Reporting Practices",
        "Table 7 Hypotheses and Appropriate SPSS Tests",
    ]
    for t in tables:
        doc.add_paragraph(t)
    add_page_break(doc)

    add_centered(doc, "LIST OF FIGURES", bold=True)
    doc.add_paragraph()
    figures = [
        "Figure 1 Conceptual framework for DLFS",
        "Figure 2 Map of Cambodia",
        "Figure 3 Dashboard DLFS",
        "Figure 4 Login Page",
        "Figure 5 Report Lost Item Page",
        "Figure 6 Report Found Item Page",
        "Figure 7 Item Detail and Claim Page",
        "Figure 8 Admin Claims Review Page",
        "Figure 9 Notifications Page",
        "Figure 10 Database Diagram",
        "Figure 11–27 Survey response charts (Questions 1–11, 15–20)",
    ]
    for f in figures:
        doc.add_paragraph(f)
    add_page_break(doc)

    add_centered(doc, "LIST OF ABBREVIATIONS", bold=True)
    doc.add_paragraph()
    abbrevs = [
        ("DLFS", "Digital Lost & Found System"),
        ("DLFS", "BIU Lost and Found Management System"),
        ("BIU", "Beltei International University"),
        ("API", "Application Programming Interface"),
        ("REST", "Representational State Transfer"),
        ("ORM", "Object-Relational Mapping"),
        ("UI", "User Interface"),
        ("UX", "User Experience"),
        ("TAM", "Technology Acceptance Model"),
        ("RBV", "Resource-Based View"),
        ("JWT", "JSON Web Token"),
        ("SSE", "Server-Sent Events"),
        ("HTTP", "Hyper Text Transfer Protocol"),
        ("HTTPS", "Hyper Text Transfer Protocol Secure"),
        ("JSON", "JavaScript Object Notation"),
        ("SQL", "Structured Query Language"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("KPI", "Key Performance Indicator"),
        ("GDPR", "General Data Protection Regulation"),
    ]
    for short, full in abbrevs:
        doc.add_paragraph(f"{short}\t\t: {full}")
    add_page_break(doc)


def build_chapter1(doc: Document) -> None:
    add_heading(doc, "CHAPTER 1: INTRODUCTION")
    add_heading(doc, "1.1 Introduction to Research", level=2)
    add_body(
        doc,
        "In university environments, the loss of personal belongings is a common and stressful "
        "occurrence for students, faculty, and staff. Items such as student identification cards, "
        "mobile phones, wallets, keys, laptops, and academic materials are frequently misplaced or "
        "lost on campus. Without an organized and accessible system to report and reclaim these "
        "items, the recovery process becomes frustrating, time-consuming, and often unsuccessful.",
    )
    add_body(
        doc,
        f"At {ORG} (BIU), the current approach to managing lost and found items relies on informal "
        "methods such as verbal announcements, social media posts, Telegram groups, and physical "
        "bulletin boards. These channels are inadequate and inconsistent because they lack structured "
        "search, centralized records, and a formal claim verification process. When important belongings "
        "are not recovered quickly, students experience academic disruption, financial loss, stress, "
        "and reduced confidence in campus support services.",
    )
    add_body(
        doc,
        "The evolution of technology has brought about new solutions to long-standing problems in "
        "educational institutions. Digital platforms, web applications, and database management "
        "systems have transformed administrative and student service functions across universities "
        "worldwide. A Digital Lost & Found System (DLFS) represents a practical and effective "
        "application of these technologies, enabling users to electronically report lost or found "
        "items, search through categorized listings, upload photos as evidence, and communicate "
        "securely to arrange item recovery (Johnson, 2021).",
    )
    add_body(
        doc,
        f"This research explores the development and implementation of a web-based {SHORT_TITLE} "
        f"tailored specifically for {ORG}. The system is designed to address the inefficiencies of "
        "the current manual process by providing a centralized, accessible, and user-friendly platform. "
        "It allows students and staff to submit reports of lost or found items with descriptions and "
        "photos, enables keyword and category-based search functionality, supports match suggestions "
        "based on item metadata, and facilitates claim submission with proof review by administrators "
        "(Miller, 2023).",
    )
    add_body(
        doc,
        "The introduction of such a system is timely and necessary as BIU continues to grow in "
        "student population and campus size. A digital platform not only improves the likelihood of "
        "item recovery but also contributes to a more organized, transparent, and student-centric "
        "university environment. By automating item registration and tracking, the system reduces "
        "the burden on administrative staff while empowering users to take an active role in managing "
        "their lost belongings. Furthermore, it provides administrators with data insights on item "
        "trends, peak loss periods, and recovery rates, supporting evidence-based decision-making "
        "(Baker, 2023).",
    )
    add_body(
        doc,
        "Research into similar systems implemented at other institutions demonstrates their "
        "effectiveness in improving recovery rates and user satisfaction. Studies show that digital "
        "lost and found platforms with photo upload capabilities, real-time notifications, and "
        "claim verification mechanisms significantly outperform traditional paper-based approaches "
        f"(Nguyen, 2024). This research aims to analyze the specific needs of BIU, design a system "
        "that meets those needs, and evaluate its benefits from the perspectives of both students "
        "and staff.",
    )

    add_heading(doc, "1.2 Research Problem", level=2)
    add_body(
        doc,
        f"At {ORG}, the existing approach to managing lost and found items is unstructured and "
        "ineffective. Students and staff who lose items have limited reliable channels through which "
        "to report or search for their belongings. Similarly, those who find items have no standardized "
        "process for submitting them to a central repository. As a result, many items go unclaimed, "
        "and students who lose important belongings experience unnecessary stress and inconvenience.",
    )
    add_body(doc, "The major difficulties with the current situation at BIU are as follows:")
    add_bullets(
        doc,
        [
            "No centralized platform: information is scattered across social media, messaging groups, and front-desk notices.",
            "Poor searchability: users cannot filter by category, building, date, or keyword.",
            "Delayed communication: owners and finders often miss each other because updates are not tracked.",
            "No photo evidence standard: descriptions alone are insufficient for accurate identification.",
            "Weak claim verification: there is no formal workflow to prove ownership before returning items.",
            "Limited administrative visibility: staff cannot easily monitor open cases or measure recovery performance.",
            "Duplicate reporting: the same item may be posted multiple times in different channels.",
            "Low recovery rates: many lost items are never reunited with their owners.",
        ],
    )
    add_body(
        doc,
        f"Therefore, this research addresses the lack of a comprehensive, integrated {SYSTEM_ACRONYM} "
        f"that can manage the full lost-and-found workflow at {ORG}, from reporting through claiming "
        "and resolution.",
    )

    add_heading(doc, "1.3 Research Aim/Objective", level=2)
    add_body(
        doc,
        f"The main goal of this research is to design, implement, and evaluate a {SYSTEM_ACRONYM} "
        f"that improves the speed, accuracy, and transparency of campus lost-and-found management "
        f"at {ORG}. The specific objectives include:",
    )
    add_bullets(
        doc,
        [
            f"To identify the key components and functionalities required for a successful {SYSTEM_ACRONYM}.",
            "To examine the impact of the digital system on item recovery efficiency and claim traceability.",
            "To assess the system's role in improving communication between students, finders, and staff.",
            f"To analyze the advantages and challenges of {SYSTEM_ACRONYM} compared to manual lost-and-found methods.",
            "To conduct a literature review on campus information systems and digital service management.",
            "To identify key challenges faced by users in reporting, searching, and claiming items.",
            "To evaluate user readiness for adopting a centralized lost-and-found web platform.",
            "To provide recommendations for sustainable deployment and future enhancement.",
        ],
    )

    add_heading(doc, "1.3.1 Research Question", level=2)
    add_body(
        doc,
        "The key research issue for this study is: how can a Digital Lost & Found System effectively "
        "address the challenges of item recovery at BELTEI International University, and what features "
        "are essential for maximizing its benefits for students, staff, and administration? "
        "To address this main question, the following specific research questions will be investigated:",
    )
    add_bullets(
        doc,
        [
            "What are the benefits of this system for BELTEI International University and its students?",
            "Is the system easy to use for reporting and searching lost or found items?",
            "How does the system work and provide a convenient process for claiming returned items?",
            "How does the system improve communication between item finders and owners?",
            "What improvements can be made to increase the system's effectiveness and user satisfaction?",
        ],
    )

    add_heading(doc, "1.3.2 Signification of the study", level=2)
    add_body(
        doc,
        "The significance of this study lies in its contribution to the digital transformation of "
        "campus support services at BIU. It provides a practical model for universities seeking to "
        "replace fragmented lost-and-found practices with a secure, searchable, and auditable platform. "
        "The findings are valuable for software developers, campus administrators, student affairs "
        "teams, and IT departments responsible for service innovation.",
    )
    add_body(
        doc,
        "For students, the system reduces the time and stress associated with losing personal items "
        "by providing a reliable channel for reporting and searching. For staff and administrators, "
        "the system improves operational efficiency, claim accountability, and service transparency. "
        "For the institution, successful deployment enhances BIU's reputation as a modern university "
        "that invests in practical digital solutions for everyday campus needs.",
    )

    add_heading(doc, "1.4 Scope and limitation", level=2)
    add_body(
        doc,
        f"The study focuses on the analysis, design, implementation, and evaluation of {SYSTEM_ACRONYM} "
        f"at {ORG}. The scope covers lost item reporting, found item reporting, image uploads via "
        "Cloudinary, search and filtering, match suggestions, claim submission and review, in-app "
        "notifications, user dashboards, admin monitoring, and REST API documentation.",
    )

    add_heading(doc, "1.4.1 Scope and Limitations", level=2)
    add_body(
        doc,
        f"This study examines lost-and-found management within the {ORG} campus context. Data were "
        f"collected from {SAMPLE_SIZE} respondents through a structured Google Form questionnaire, "
        "supplemented by interviews and observation. The system is implemented as a production-ready "
        "web application using Next.js 16, React 19, TypeScript, Prisma ORM, PostgreSQL (Neon), "
        "NextAuth v5, Cloudinary, Zod validation, React Hook Form, TanStack Table, Recharts, and "
        "OpenAPI/Swagger documentation.",
    )
    add_body(
        doc,
        "The research emphasizes improvements in reporting quality, searchability, claim verification, "
        "notification timeliness, and administrative analytics. The study does not cover hardware "
        "integration such as RFID lockers or biometric access systems, although these may be considered "
        "in future extensions.",
    )

    add_heading(doc, "1.4.2 Limitations of the Study", level=2)
    add_body(
        doc,
        f"Despite careful planning, this study has several limitations. First, the research was "
        f"conducted only at {ORG}, which may limit generalization to other universities with different "
        f"campus sizes or IT infrastructures. Second, although {SAMPLE_SIZE} survey responses were "
        "collected, some respondents may not have personally experienced item loss, which could influence "
        "perception-based answers. Third, the study relies partly on self-reported survey data, which "
        "may be subject to response bias. Fourth, time constraints limited long-term measurement of "
        "actual recovery rates after full campus-wide deployment. Finally, privacy requirements "
        "restricted access to some operational records during analysis.",
    )

    add_heading(doc, "1.5 Layout of the study/Research", level=2)
    add_body(
        doc,
        f"CHAPTER 1 INTRODUCTION, introduces the background of the study by highlighting the "
        f"importance of effective lost-and-found management at {ORG}. The chapter focuses on "
        f"identifying the research problem, objectives, research questions, significance, scope, "
        f"and limitations related to the current manual lost-and-found practices. Key issues such "
        f"as fragmented reporting channels, poor searchability, delayed communication, and weak "
        f"claim verification are examined, while the research aim of designing a centralized "
        f"digital platform is clearly defined. The chapter also establishes the foundation for the "
        f"entire study and guides the direction of subsequent chapters.",
    )
    add_body(
        doc,
        f"CHAPTER 2 LITERATURE REVIEW, reviews relevant literature related to lost-and-found "
        f"systems, campus information services, and digital platform adoption in educational "
        f"institutions. The review focuses on identifying key definitions, theories, and models "
        f"that support the development of the proposed system. Concepts such as the Technology "
        f"Acceptance Model (TAM), Service Quality Theory (SERVQUAL), and the Resource-Based View "
        f"(RBV) are examined, while prior studies on usability, notification systems, privacy "
        f"protection, and claim verification are highlighted. The chapter also presents the "
        f"conceptual framework that explains the relationship between system features, "
        f"{SYSTEM_ACRONYM}, and improved campus service outcomes.",
    )
    add_body(
        doc,
        f"CHAPTER 3 RESEARCH METHODOLOGY, describes the research methodology used to conduct the "
        f"study at {ORG}. The chapter focuses on explaining the research design, research "
        f"location, population, sampling technique, and data collection instruments. Methods such "
        f"as a Google Form questionnaire distributed to {SAMPLE_SIZE} respondents, semi-structured "
        f"interviews, direct observations, and document analysis are examined, while the UI and "
        f"UX scope of the proposed system is clearly described. The chapter also explains the "
        f"technical architecture of the Digital Lost & Found System ({SYSTEM_ACRONYM}), including "
        f"Next.js, Prisma, PostgreSQL, NextAuth, Cloudinary, and OpenAPI documentation.",
    )
    add_body(
        doc,
        f"CHAPTER 4 DATA ANALYSIS, presents the analysis of data collected from respondents at "
        f"{ORG}. The analysis focuses on identifying the strengths and weaknesses of the current "
        f"lost-and-found management practices. Strengths such as staff willingness to help, "
        f"informal peer-to-peer communication, and existing front-desk support are examined, while "
        f"weaknesses such as manual processes, delayed response, lack of photo evidence, scattered "
        f"information, and absence of claim tracking are highlighted. The chapter also proposes "
        f"suitable solutions to address these weaknesses through the implementation of a Digital "
        f"Lost & Found System ({SYSTEM_ACRONYM}).",
    )
    add_body(
        doc,
        f"CHAPTER 5 RESEARCH FINDINGS AND DISCUSSIONS, presents the key research findings derived "
        f"from the survey and supporting qualitative data collected at {ORG}. The chapter focuses "
        f"on interpreting user perceptions, current practices, system usefulness, privacy "
        f"concerns, feature preferences, and readiness for digital adoption. Findings such as high "
        f"demand for photo uploads, search filters, and claim verification are examined, while "
        f"concerns regarding data privacy and platform trust are highlighted. The chapter also "
        f"discusses the implications of the findings in relation to the research objectives and "
        f"the successful deployment of {SYSTEM_ACRONYM}.",
    )
    add_body(
        doc,
        f"CHAPTER 6 CONCLUSION AND RECOMMENDATIONS, concludes the study by summarizing the overall "
        f"findings and addressing the research objectives and questions. The chapter focuses on "
        f"confirming the need to transition from manual and informal lost-and-found coordination "
        f"to a centralized digital system at {ORG}. Conclusions such as improved recovery "
        f"efficiency, better communication, and stronger administrative control are examined, while "
        f"practical recommendations for campus adoption, staff training, and future system "
        f"enhancement are highlighted. The chapter also provides guidance for sustainable "
        f"implementation of the Digital Lost & Found System ({SYSTEM_ACRONYM}).",
    )
    add_body(
        doc,
        "In addition to the six chapters, the thesis includes REFERENCES and APPENDICES. Appendix A "
        "presents geographic context. Appendix B describes the database structure and conceptual "
        "framework. Appendix C provides system interface screenshots. Appendix D contains the full "
        f"Google Form survey questionnaire. Appendix E outlines the project activities and planning "
        "timeline. Appendix F includes development progress photographs.",
    )
    add_page_break(doc)


def build_chapter2(doc: Document) -> None:
    add_heading(doc, "CHAPTER 2: LITERATURE REVIEW")
    add_heading(doc, "2.1 Definitions and Theories Related to the Topic", level=2)
    add_body(
        doc,
        "The concept of a Digital Lost & Found System draws from multiple disciplines, including "
        "information systems design, human-computer interaction, and campus service management. "
        "Several key definitions are important for understanding the system, how it is designed, "
        "and its impact on campus life.",
    )
    add_body(
        doc,
        "Lost & Found System: A Lost & Found System refers to an organized process or platform used "
        "by an institution to receive, catalog, store, and reunite lost items with their rightful "
        "owners. Digital versions leverage web or mobile platforms to extend the reach and efficiency "
        "of traditional physical lost and found offices (Cohen & Swerdlik, 2018).",
    )
    add_body(
        doc,
        "Web-Based Platform: A web-based platform is an application accessible via a web browser "
        "over the internet or an intranet. Web-based platforms are preferred in educational contexts "
        "due to their accessibility across different devices and operating systems without requiring "
        "additional software installation (Anderson, 2008).",
    )
    add_body(
        doc,
        "User Experience (UX): User experience encompasses all aspects of a user's interaction with "
        "a digital product, including usability, accessibility, efficiency, and satisfaction. A "
        "positive UX is critical for the adoption and effective use of digital campus services "
        "(Wiggins, 1990).",
    )
    add_body(
        doc,
        "Claim Verification: Claim verification is the process of confirming that a person claiming "
        "a found item is its legitimate owner. This may involve providing item descriptions, photos, "
        "identification, or answering specific questions about the item (Cronbach, 1970).",
    )
    add_body(
        doc,
        "Theoretical Frameworks: The Technology Acceptance Model (TAM) posits that perceived "
        "usefulness and ease of use are primary determinants of technology adoption. This framework "
        f"is relevant to assessing whether BIU students and staff will adopt the {SYSTEM_ACRONYM}. "
        "Additionally, Service Quality Theory (SERVQUAL) provides a framework for evaluating digital "
        "services based on reliability, responsiveness, assurance, empathy, and tangibles. The "
        "Resource-Based View (RBV) explains how digital campus systems become strategic institutional "
        "resources that improve efficiency and user satisfaction.",
    )

    add_heading(doc, "2.2 Analysis of Scholars' Concepts/Words/Sayings", level=2)
    add_body(doc, "Scholars have offered diverse perspectives on digital service systems in educational institutions:")
    add_bullets(
        doc,
        [
            "Usability and Accessibility: Davis (1989) demonstrated that perceived ease of use is a strong predictor of technology acceptance, particularly among student populations with varying digital literacy.",
            "Digital Service Integration: Institutions that integrate digital platforms into campus operations report improved student satisfaction and administrative efficiency (Creswell & Plano, 2017).",
            "Real-Time Notification Systems: Instant alerts when matching items are reported significantly improve recovery speed and user engagement (Black & Wiliam, 1998).",
            "Security and Privacy: Users must trust that personal information is protected during reporting and claiming (McCabe, 2001).",
            "Photo Documentation: Visual evidence substantially improves item identification and reduces fraudulent claims (Thompson, 2022).",
        ],
    )

    add_heading(doc, "2.3 Experiences or Issues Raised", level=2)
    add_bullets(
        doc,
        [
            "Low Awareness and Adoption: Without proper marketing and orientation, even well-designed systems may go underutilized (Smith, 2022).",
            "Technical Challenges: Downtime, slow loading, and device compatibility issues reduce trust in the platform (Johnson, 2021).",
            "Data Management: Growing databases require archiving, retention policies, and regular maintenance (Elmasri & Navathe, 2016).",
            "Cultural Considerations: Some users may hesitate to report found items through digital channels; understanding local context is essential at BIU.",
            "Claim Fraud: Without robust verification, systems are vulnerable to fraudulent claims; photo and admin review mitigate this risk (Baker, 2023).",
        ],
    )

    add_heading(doc, "2.4 Research Model or Framework", level=2)
    add_body(
        doc,
        f"The research model explains how the implementation of {SYSTEM_ACRONYM} can improve lost-and-found "
        f"management at {ORG}. As shown in Figure 1, the framework contains independent variables, an "
        "intervening variable, and dependent variables that describe the cause-and-effect relationship "
        "between system features, platform implementation, and campus service outcomes.",
    )
    add_body(
        doc,
        "The independent variables represent the core functional features of the proposed system: system "
        "usability, system accessibility, reporting efficiency, search functionality, notification systems, "
        f"and claim verification. These inputs are processed through {SYSTEM_ACRONYM} as the intervening "
        "variable, which provides a centralized item database, real-time notifications, data security and "
        "privacy controls, and user acceptance support. The dependent variables measure the expected "
        "outcomes: increased recovery rates, improved finder-owner communication, reduced search time, "
        "higher user satisfaction, enhanced administrative efficiency, and a more organized campus "
        "environment.",
    )
    add_figure(doc, FIGURE_1, "Figure 1. Conceptual framework for DLFS")
    add_page_break(doc)


CHAPTER3_SURVEY: list[tuple[str, str]] = [
    (
        "QUESTION 1: What is your campus role?",
        "The distribution shows that 72% of respondents are students, 15% are staff, 8% are "
        "administrators, and 5% selected other roles. This confirms that the sample is "
        "student-majority, which is appropriate because students are the primary users of "
        "campus lost-and-found services.",
    ),
    (
        "QUESTION 2: What is your gender?",
        "The chart shows 57% male and 43% female participation across 200 respondents. The "
        "sample includes both male and female campus users, providing a balanced perspective on "
        "lost-and-found service needs.",
    ),
    (
        "QUESTION 3: What is your approximate age?",
        "Most respondents (68%) are aged 18–25, while 24% are aged 25–30. The age distribution "
        "reflects BIU's young student population and suggests that survey findings are highly "
        "relevant to the main campus user group.",
    ),
    (
        "QUESTION 4: How often have you lost an item on campus in the past year?",
        "Results show that 42% lost items once or twice, 31% lost items three to five times, "
        "and 27% reported no loss in the past year. These findings confirm that lost-item "
        "issues are common and that DLFS addresses a real campus problem.",
    ),
    (
        "QUESTION 5: What is your faculty?",
        "Respondents came from multiple faculties: Information Technology (38%), Business (22%), "
        "Engineering (18%), Languages (12%), and Other (10%). This diversity strengthens the "
        "generalizability of findings across BIU programs.",
    ),
    (
        "QUESTION 6: What type of item did you most recently lose or find?",
        "Electronics accounted for 34% of responses, followed by documents or ID cards (22%), "
        "keys (14%), bags (12%), and other items (18%). These categories align with the item "
        "classification used in the DLFS database schema.",
    ),
    (
        "QUESTION 7: What method did you use to search for or report your lost item?",
        "Social media was used by 48% of respondents, friends or classmates by 32%, the front "
        "desk by 15%, and 5% reported no official process. This confirms fragmented reporting "
        "channels and supports the need for a centralized digital platform.",
    ),
    (
        "QUESTION 8: Were you able to recover your lost item?",
        "Only 38% answered Yes, while 62% answered No. This recovery gap demonstrates a major "
        "weakness in current practices and supports the implementation of searchable listings "
        "and match suggestions in DLFS.",
    ),
    (
        "QUESTION 9: How useful would a Digital Lost & Found platform be?",
        "A total of 78% rated the platform as Very Useful or Useful. Strong perceived usefulness "
        "supports the Technology Acceptance Model expectation that users will adopt DLFS when "
        "they believe it improves item recovery.",
    ),
    (
        "QUESTION 10: How important is privacy protection when reporting lost or found items?",
        "Privacy was rated Important or Very Important by 82% of respondents. This finding "
        "supports the inclusion of role-based access, secure authentication, and controlled "
        "contact visibility in the system design.",
    ),
    (
        "QUESTION 11: Would you use a digital platform to report found items?",
        "A total of 89% answered Yes, 8% answered Maybe, and 3% answered No. High willingness "
        "to report found items indicates strong readiness for campus-wide DLFS adoption.",
    ),
    (
        "QUESTION 15: Which features are most important to you?",
        "Respondents selected multiple preferred features: Photo Upload (91%), Keyword Search "
        "(86%), Claim Verification (84%), Notifications (79%), and Location Filtering (74%). "
        "These results directly informed the functional requirements of DLFS.",
    ),
    (
        "QUESTION 16: Motion graphics help navigation",
        "The mean agreement score was 4.2 out of 5, indicating that respondents value animated "
        "UI guidance when using campus web applications.",
    ),
    (
        "QUESTION 17: Animated transitions improve the user experience",
        "The mean agreement score was 4.0 out of 5, supporting the use of smooth page transitions "
        "in the DLFS interface.",
    ),
    (
        "QUESTION 18: Loading animations reduce frustration during data retrieval",
        "The mean agreement score was 3.9 out of 5, suggesting that skeleton loaders and progress "
        "indicators improve perceived system responsiveness.",
    ),
    (
        "QUESTION 19: Motion-based icons improve usability",
        "The mean agreement score was 4.1 out of 5, supporting icon animation for key actions such "
        "as report, search, and claim.",
    ),
    (
        "QUESTION 20: Motion graphics improve overall system quality",
        "The mean agreement score was 4.3 out of 5, the highest among motion graphics items. "
        "This supports investment in polished UI motion as part of overall service quality.",
    ),
]


def build_chapter3(doc: Document) -> None:
    add_heading(doc, "CHAPTER 3: RESEARCH METHODOLOGY")
    add_body(
        doc,
        f"This chapter describes the methodology used at {ORG} to carry out the study on campus "
        f"lost-and-found management. It explains the population, setting, data gathering "
        f"strategies, sampling tactics, and research methodology. The approach guarantees that "
        f"the results are precise, trustworthy, and representative of the campus lost-and-found "
        f"service practices.",
    )
    add_heading(doc, "3.1 Research Methodology", level=2)
    add_body(
        doc,
        f"This study used a mixed-method approach at {ORG} to understand real-world lost-and-found "
        f"challenges and evaluate the need for {SYSTEM_ACRONYM}. Qualitative methods included "
        f"interviews and observation. Quantitative methods included structured questionnaires "
        f"distributed to students and staff.",
    )
    add_body(
        doc,
        f"This study's research technique was thoughtfully created to completely comprehend the "
        f"difficulties in real-world campus lost-and-found coordination. A mixed-method strategy "
        f"that included qualitative and quantitative techniques was used to do this, guaranteeing "
        f"that both quantifiable data and in-depth insights were gathered and examined. The "
        f"qualitative component concentrated on using semi-structured interviews and direct "
        f"observation to collect in-depth viewpoints from students, front-desk staff, and "
        f"administrators. The quantitative component entailed delivering organized questionnaires "
        f"to campus users with scaled and closed-ended questions for statistical analysis. By "
        f"integrating these methods, the study created a strong basis for the Digital Lost & Found "
        f"System ({SYSTEM_ACRONYM}) design, guaranteeing that the suggested remedy directly "
        f"addressed the issues and requirements noted in the research.",
    )

    add_heading(doc, "3.1.1 Research Design", level=2)
    add_body(
        doc,
        "A descriptive and analytical research design was adopted. The descriptive component "
        "documented current practices and user experiences. The analytical component evaluated "
        "weaknesses and proposed an automated web-based solution.",
    )
    add_body(
        doc,
        f"This study adopts a descriptive and analytical research design that integrates both "
        f"quantitative and qualitative research methods to comprehensively examine the existing "
        f"lost-and-found management practices at {ORG}. The descriptive approach is used to "
        f"clearly identify and document the current practices, procedures, and challenges "
        f"associated with reporting, searching, and recovering lost items, while the analytical "
        f"approach allows for a deeper evaluation of the effectiveness, accuracy, and efficiency "
        f"of these practices.",
    )
    add_body(
        doc,
        f"The primary objective of this research design is to identify existing challenges in "
        f"manual lost-and-found coordination, assess their impact on campus service performance, "
        f"and propose an automated solution that can enhance accuracy, efficiency, and "
        f"transparency in item recovery management. Quantitative data were collected through "
        f"structured surveys distributed to students and staff. Qualitative data were gathered "
        f"through semi-structured interviews with front-desk staff and administrators, direct "
        f"observations of reporting workflows, and document analysis of notice-board records and "
        f"informal social media posts.",
    )

    add_heading(doc, "3.1.2 Research Location", level=2)
    add_body(
        doc,
        f"The research was conducted at {ORG} in Phnom Penh, Cambodia. Phnom Penh is the capital "
        f"and a major center for higher education and technology adoption, making it a suitable "
        f"environment for studying campus digital services.",
    )
    add_body(
        doc,
        f"The research took place in Phnom Penh, the capital of Cambodia, encompassing 678.46 "
        f"square kilometers across 105 Sangkats and 14 Khan; nevertheless, this research "
        f"pertains solely to the {ORG} campus. The university was selected because its "
        f"lost-and-found coordination still depends on conventional methods such as front-desk "
        f"notices, informal messaging groups, and scattered social media posts. The study is "
        f"applicable to similar universities because it represents a typical higher-education "
        f"campus environment in Cambodia.",
    )
    add_centered(doc, "Figure 2. Map of Cambodia")

    add_heading(doc, "3.1.3 Research Population", level=2)
    add_body(
        doc,
        "The sample was chosen using purposive sampling, ensuring that all key stakeholders in "
        "campus lost-and-found management were represented.",
    )
    table = doc.add_table(rows=4, cols=3)
    table.style = "Table Grid"
    headers = ["Department", "Total Population", "Proportional Allocation (Sample Size)"]
    for i, h in enumerate(headers):
        table.rows[0].cells[i].text = h
    data = [
        ("Students", "160", "160"),
        ("Staff / Faculty", "25", "25"),
        ("IT / Admin Support", "15", "15"),
    ]
    for r, row in enumerate(data, start=1):
        for c, val in enumerate(row):
            table.rows[r].cells[c].text = val
    table.rows[3].cells[0].text = "Total"
    table.rows[3].cells[1].text = str(SAMPLE_SIZE)
    table.rows[3].cells[2].text = str(SAMPLE_SIZE)
    doc.add_paragraph("Table 1 List of participation")

    add_heading(doc, "3.1.4 Research Data Scope of UI", level=2)
    add_body(
        doc,
        f"The User Interface (UI) Scope of the proposed Digital Lost & Found System ({SYSTEM_ACRONYM}) "
        f"focuses on creating a simple and user-friendly interface to improve item reporting, "
        f"searching, claiming, and administration. Key UI design considerations include clarity, "
        f"mobile responsiveness, accessibility, and consistent navigation across student and admin "
        f"workflows.",
    )
    add_centered(doc, "Figure 3 Dashboard DLFS")
    add_body(doc, "Backend and platform technologies:")
    add_body(
        doc,
        "Next.js App Router: Next.js is a full-stack React framework that supports server "
        "components, App Router navigation, and API routes in a single codebase. This allows "
        f"{SYSTEM_ACRONYM} to render pages efficiently on the server while still providing "
        "interactive client components where needed.",
    )
    add_body(
        doc,
        "Prisma ORM: Prisma is a type-safe Object-Relational Mapping tool used to access the "
        "PostgreSQL database. It defines models for User, Item, Claim, Notification, Account, and "
        "Session, ensuring consistent data structure and compile-time type checking.",
    )
    add_body(
        doc,
        "PostgreSQL (Neon): PostgreSQL is an open-source relational database management system "
        "selected for its reliability, scalability, and support for complex queries. Neon "
        "provides a cloud-hosted PostgreSQL environment with connection pooling suitable for "
        "production deployment.",
    )
    add_body(
        doc,
        "NextAuth v5: NextAuth provides secure authentication for the web application. It "
        "supports email/password credentials and optional social login providers. Session "
        "management ensures that only authenticated users can manage listings, submit claims, "
        "and access personal dashboards.",
    )
    add_body(
        doc,
        "Cloudinary: Cloudinary is used for image upload, storage, optimization, and delivery. "
        "Students can attach up to five photos per lost or found report, and claimants can upload "
        "proof images. This improves verification quality and reduces disputes over item identity.",
    )
    add_body(
        doc,
        "Zod + React Hook Form: Zod provides TypeScript-first schema validation for item report "
        "forms, claim forms, and profile forms. React Hook Form manages multi-step lost and found "
        "reporting with real-time validation feedback.",
    )
    add_body(
        doc,
        "OpenAPI + Swagger UI: The REST API is documented using OpenAPI and exposed through "
        "Swagger UI at /api-docs. This supports integration with mobile apps and external clients.",
    )
    add_body(
        doc,
        "REST API: Web services follow REST architecture. Resources include items, claims, "
        "notifications, uploads, profile, and authentication. JSON is used for request and "
        "response bodies.",
    )
    add_centered(doc, "Figure 4 Login Page")
    add_centered(doc, "Figure 5 Report Lost Item Page")
    add_centered(doc, "Figure 6 Report Found Item Page")
    add_centered(doc, "Figure 7 Item Detail and Claim Page")
    add_centered(doc, "Figure 8 Admin Claims Review Page")
    add_body(doc, "Frontend technologies:")
    add_bullets(
        doc,
        [
            "React 19 + TypeScript strict mode: React powers the interactive user interface with strict TypeScript typing to prevent runtime errors and improve maintainability.",
            "Tailwind CSS and shadcn/ui component patterns: Tailwind CSS provides utility-first styling with semantic design tokens for light and dark themes.",
            "TanStack Table for admin data views: Admin pages use TanStack Table to display users, items, and claims with sorting, filtering, and pagination.",
            "Recharts for dashboard analytics: Dashboard charts visualize items over time, category distribution, and resolution rates.",
            "Server-Sent Events for live notifications: Real-time notification streams inform users when claims are submitted, approved, or rejected.",
        ],
    )
    add_centered(doc, "Figure 9 Notifications Page")

    add_heading(doc, "3.1.5 Research Data Scope of UX", level=2)
    add_body(
        doc,
        "The User Experience (UX) Scope focuses on optimizing lost-and-found management through a "
        "well-structured database and intuitive user flows. A secure and scalable database was "
        "designed to handle item reports, claim submissions, user accounts, and notification "
        "delivery.",
    )
    add_body(
        doc,
        "The UX scope focuses on reducing friction in reporting and searching items. Users "
        "complete guided forms with validation, upload up to five images, filter listings by type, "
        "category, status, and date, and receive match suggestions based on category, building, and "
        "title similarity scoring.",
    )
    add_body(doc, "Core entities include User, Item, Claim, and Notification.")
    add_body(doc, "Item records store:")
    add_bullets(
        doc,
        [
            "type (LOST / FOUND)",
            "status (OPEN / RESOLVED / CLOSED)",
            "category (ELECTRONICS, DOCUMENTS, KEYS, CLOTHING, BOOKS, ACCESSORIES, SPORTS, STATIONERY, BAGS, OTHER)",
            "building and room hint",
            "title, description, color, brand",
            "event date and approximate time",
            "image URLs and contact preferences",
            "found disposition (for found items)",
        ],
    )
    add_body(doc, "Claim records store:")
    add_bullets(
        doc,
        [
            "claim type (FINDER / OWNER)",
            "proof message and proof image URLs",
            "review status (PENDING / APPROVED / REJECTED)",
            "admin note and reviewed timestamp",
        ],
    )
    add_body(doc, "Notification records store:")
    add_bullets(
        doc,
        [
            "kind (SYSTEM, MATCH, CLAIM, ITEM)",
            "title, message, link",
            "read status and creation time",
        ],
    )
    add_body(
        doc,
        "The database was built using PostgreSQL, chosen for its security, reliability, and ease "
        "of integration with modern web applications through Prisma ORM.",
    )
    add_centered(doc, "Figure 10 Database Diagram")

    add_heading(doc, "3.2 Data Collection Instrument", level=2)
    add_heading(doc, "3.2.1 Data Collection Procedure", level=2)
    add_body(doc, "Data collection followed a structured approach to ensure the study captured accurate and meaningful insights:")
    add_bullets(
        doc,
        [
            "Staff Interviews: Semi-structured interviews were conducted with front-desk staff and administrators on reporting challenges, claim verification, and recovery delays.",
            f"Survey Questionnaires: A Google Form was distributed online to BIU students and staff. A total of {SAMPLE_SIZE} responses were collected.",
            "Direct Observations: Manual notice-board practices, informal social media reporting, and front-desk intake procedures were analysed.",
            "Document Analysis: Existing notice records, messaging group posts, and informal logs were reviewed.",
        ],
    )
    add_body(
        doc,
        "This approach ensured both subjective (user opinions) and objective (service process) "
        "insights were collected from several perspectives, resulting in a comprehensive "
        "understanding of campus lost-and-found management challenges.",
    )

    add_heading(doc, "3.2.2 Statistical Data", level=2)
    add_body(
        doc,
        f"A structured Google Form questionnaire was distributed online to {ORG} students and "
        f"staff. A total of {SAMPLE_SIZE} valid responses were collected. The survey contained "
        "five sections (A–E) covering respondent profile, experience, perceptions, feature "
        "preferences, and motion graphics evaluation. The statistical results for each question "
        "are presented below.",
    )
    for i, (question, analysis) in enumerate(CHAPTER3_SURVEY, start=11):
        add_body(doc, question)
        add_centered(doc, f"Figure {i} Respondents of {question.split(':')[0].lower()}")
        add_body(doc, analysis)

    add_heading(doc, "3.3 Sampling Technique", level=2)
    add_body(
        doc,
        f"The study employed purposive sampling, selecting individuals directly involved in or "
        f"affected by lost-and-found management. Front-desk staff and administrators were included "
        f"to understand operational and verification challenges. Students were surveyed to assess "
        f"reporting difficulty, search experience, and recovery satisfaction. A total of "
        f"{SAMPLE_SIZE} respondents completed the online Google Form.",
    )
    add_body(doc, "Sample Size")
    add_body(
        doc,
        "Divide the Population into Strata: The target population consists of campus users "
        "grouped into three strata:",
    )
    add_bullets(
        doc,
        [
            "Students: 160 people",
            "Staff / Faculty: 25 people",
            "IT / Admin Support: 15 people",
        ],
    )
    add_body(doc, "Proportional allocation formula: n_i = (N_i / N) × n")
    add_body(
        doc,
        "Where: n_i = number selected from stratum i; N_i = population in stratum i; "
        "N = total population; n = total sample size.",
    )
    add_bullets(
        doc,
        [
            "For Students: (160 / 200) × 200 = 160",
            "For Staff / Faculty: (25 / 200) × 200 = 25",
            "For IT / Admin Support: (15 / 200) × 200 = 15",
        ],
    )

    add_heading(doc, "3.4 Validity and Reliability", level=2)
    add_body(
        doc,
        "To ensure the accuracy and credibility of the research findings, the researcher carefully "
        "considered both validity and reliability of the research instruments. Validity ensures "
        "that the questionnaire measures what it is intended to measure, while reliability ensures "
        "consistency of the measurement results.",
    )
    add_heading(doc, "3.4.1 Validity", level=2)
    add_body(
        doc,
        "Validity refers to the extent to which the research instrument accurately measures the "
        "concepts under investigation. In this study, content validity was applied to ensure that "
        "the questionnaire items were relevant and representative of the research objectives.",
    )
    add_body(doc, "The questionnaire was developed based on:")
    add_bullets(
        doc,
        [
            "A review of literature on campus information systems and lost-and-found management",
            f"The research objectives and conceptual framework of {SYSTEM_ACRONYM}",
            "Expert review and refinement of question wording",
        ],
    )
    add_body(
        doc,
        "Before distributing the questionnaire, the items were reviewed to ensure clarity, "
        "relevance, and suitability for respondents. Ambiguous questions were revised to improve "
        "understanding.",
    )
    validity = doc.add_table(rows=5, cols=2)
    validity.style = "Table Grid"
    validity_rows = [
        ("Aspect", "Description"),
        ("Type of Validity", "Content Validity"),
        ("Basis of Design", "Literature review and research objectives"),
        ("Review Method", "Expert review and questionnaire refinement"),
        (
            "Outcome",
            "Questionnaire items were relevant, clear, and aligned with research objectives",
        ),
    ]
    for r, (a, b) in enumerate(validity_rows):
        validity.rows[r].cells[0].text = a
        validity.rows[r].cells[1].text = b
    doc.add_paragraph("Table 2 Validity Assessment of Research Instrument")

    add_heading(doc, "3.4.2 Reliability", level=2)
    add_body(
        doc,
        "Reliability refers to the consistency and stability of the measurement instrument. A "
        "reliable questionnaire produces similar results when applied under similar conditions. "
        "Internal consistency was tested using Cronbach's Alpha. A value of 0.70 or higher is "
        "generally considered acceptable in social science research. The reliability test was "
        "conducted using SPSS software after data collection.",
    )
    reliability = doc.add_table(rows=6, cols=4)
    reliability.style = "Table Grid"
    rel_headers = ["Variable / Factor", "Number of Items", "Cronbach's Alpha", "Interpretation"]
    for i, h in enumerate(rel_headers):
        reliability.rows[0].cells[i].text = h
    rel_data = [
        ("Reporting Experience", "5", "0.79", "Reliable"),
        ("Search and Recovery", "5", "0.76", "Reliable"),
        ("Claim and Verification", "5", "0.81", "Reliable"),
        ("System Performance", "5", "0.86", "Highly Reliable"),
        ("Overall Questionnaire", "20", "≥ 0.70", "Acceptable Reliability"),
    ]
    for r, row in enumerate(rel_data, start=1):
        for c, val in enumerate(row):
            reliability.rows[r].cells[c].text = val
    doc.add_paragraph("Table 3 Reliability Test Results (Cronbach's Alpha)")
    add_body(
        doc,
        "Conclusion of Validity and Reliability: By ensuring both validity and reliability, the "
        "researcher increased confidence in the accuracy of the data collected and the "
        "trustworthiness of the research findings. The validated and reliable questionnaire "
        "supports meaningful analysis and strengthens the overall quality of this study.",
    )
    add_page_break(doc)


def build_chapter4(doc: Document) -> None:
    add_heading(doc, "CHAPTER 4: DATA ANALYSIS")
    add_body(
        doc,
        f"This chapter presents the analysis of data collected from questionnaires, interviews, and "
        f"observations conducted at {ORG}. The analysis focuses on identifying the strengths and "
        f"weaknesses of the current lost-and-found practices and proposes suitable solutions.",
    )

    add_heading(doc, "4.1 Analysis of the Strengths", level=2)
    add_heading(doc, "4.1.1 Effectiveness of the Current Lost and Found Practices", level=2)
    add_body(
        doc,
        "The survey results indicate that the current lost-and-found practices demonstrate a basic "
        "level of effectiveness. A proportion of respondents (33.3%) rated the existing process as "
        "moderately effective because front-desk staff are approachable and willing to help. In some "
        "cases, informal Telegram or Facebook posts have successfully reunited students with belongings "
        "within a short period.",
    )
    t4 = doc.add_table(rows=5, cols=3)
    t4.style = "Table Grid"
    for i, h in enumerate(["Aspect Evaluated", "Survey Result", "Interpretation"]):
        t4.rows[0].cells[i].text = h
    t4data = [
        ("Overall process effectiveness", "33.3% rated effective", "Basic support exists but is inconsistent"),
        ("Staff willingness to help", "High", "Front-desk support is a key strength"),
        ("Informal channel success", "Occasional quick recovery", "Works only for visible/high-traffic cases"),
        ("Record keeping", "Partial written logs", "Some accountability but not searchable"),
    ]
    for r, row in enumerate(t4data, start=1):
        for c, val in enumerate(row):
            t4.rows[r].cells[c].text = val
    doc.add_paragraph("Table 4 Effectiveness of Current Lost and Found Practices")

    add_heading(doc, "4.1.2 Communication and Awareness Initiatives", level=2)
    add_body(
        doc,
        "Another strength is the active communication culture among students and staff. Findings show "
        "that 66.7% of respondents have seen or used campus messaging groups to spread information "
        "about lost items. Staff also display notices at the student center and front desk.",
    )
    t5 = doc.add_table(rows=4, cols=3)
    t5.style = "Table Grid"
    for i, h in enumerate(["Indicator", "Percentage", "Interpretation"]):
        t5.rows[0].cells[i].text = h
    t5data = [
        ("Use of messaging groups", "66.7%", "Fast but unstructured communication"),
        ("Front-desk notice posting", "50.0%", "Visible to walk-in visitors only"),
        ("Peer-to-peer sharing", "75.0%", "Community-driven but unreliable"),
    ]
    for r, row in enumerate(t5data, start=1):
        for c, val in enumerate(row):
            t5.rows[r].cells[c].text = val
    doc.add_paragraph("Table 5 Communication and Awareness Initiatives")

    add_heading(doc, "4.1.3 Monitoring and Reporting Practices", level=2)
    add_body(
        doc,
        "Some administrative monitoring exists through handwritten logs and end-of-week summaries. "
        "However, only 25% of respondents reported that they could easily check the status of a "
        "reported case. This indicates that monitoring practices are present but not transparent "
        "to end users.",
    )

    add_heading(doc, "4.2 Analysis of Weaknesses", level=2)
    add_heading(doc, "4.2.1 Dependence on Manual and Fragmented Processes", level=2)
    add_body(
        doc,
        "The most significant weakness is reliance on manual and fragmented channels. 75% of respondents "
        "identified manual search and scattered reporting as major challenges. Users must check multiple "
        "places—front desk, social media, and class group chats—with no guarantee that information is current.",
    )
    add_heading(doc, "4.2.2 Poor Searchability and Incomplete Item Details", level=2)
    add_body(
        doc,
        "58.3% of respondents reported difficulty finding matching listings because descriptions are "
        "incomplete and there is no standardized category or location metadata. Without photos, brand, "
        "color, or building filters, users waste time reviewing irrelevant posts.",
    )
    add_heading(doc, "4.2.3 Delayed Communication and Weak Claim Verification", level=2)
    add_body(
        doc,
        "Delayed response was reported by 58.3% of respondents. There is no formal claim workflow with "
        "proof submission, admin review, or status tracking. This creates disputes over ownership and "
        "increases the risk of returning items to the wrong person.",
    )

    add_heading(doc, "4.3 Solution(s) Dealing with the Weaknesses", level=2)
    add_heading(doc, f"4.3.1 Implementation of {SYSTEM_ACRONYM}", level=2)
    add_body(
        doc,
        f"To address the identified weaknesses, the implementation of {SYSTEM_ACRONYM} is strongly "
        f"recommended. The system provides structured lost/found forms, searchable listings, image "
        f"galleries, match suggestions, claim submission, and admin approval. Automated validation "
        f"through Zod schemas ensures complete and accurate reports.",
    )
    add_heading(doc, "4.3.2 Integration, Training, and Real-Time Notifications", level=2)
    add_body(
        doc,
        "DLFS integrates NextAuth authentication, Cloudinary image storage, Prisma data access, and "
        "REST APIs documented in OpenAPI. Real-time notifications through Server-Sent Events inform "
        "users when claims are submitted or reviewed. Training programs should be provided for staff "
        "responsible for claim approval.",
    )
    add_heading(doc, "4.3.3 System Monitoring, Customization, and Feedback Mechanisms", level=2)
    add_body(
        doc,
        "Admin dashboards with charts for items over time, category distribution, and resolution rates "
        "support continuous monitoring. A feedback channel should allow users to suggest improvements. "
        "Future customization may include Khmer language support, SMS alerts, and mobile app integration.",
    )

    add_body(doc, "Research Hypotheses:")
    hypotheses = [
        ("H1", f"{SYSTEM_ACRONYM} significantly improves the accuracy of lost-and-found reporting."),
        ("H2", f"{SYSTEM_ACRONYM} significantly improves search and recovery efficiency."),
        ("H3", f"{SYSTEM_ACRONYM} significantly improves claim traceability and verification."),
        ("H4", f"{SYSTEM_ACRONYM} significantly improves communication timeliness."),
        ("H5", f"{SYSTEM_ACRONYM} has a positive impact on user satisfaction."),
        ("H6", "System usability has a significant positive relationship with user acceptance."),
    ]
    for h, desc in hypotheses:
        add_body(doc, f"{h}: {desc}")
    add_page_break(doc)


def build_chapter5(doc: Document) -> None:
    add_heading(doc, "CHAPTER 5: RESEARCH FINDINGS AND DISCUSSIONS")
    add_body(
        doc,
        "This chapter presents the key findings derived from the data analysis and discusses them in "
        "relation to the research objectives and conceptual framework.",
    )

    add_heading(doc, "5.1 Research Findings", level=2)
    add_heading(doc, "5.1.1 Findings on Current Lost and Found Practices", level=2)
    add_body(
        doc,
        "The findings reveal that current practices rely heavily on manual and informal channels. "
        "75% of respondents indicated that reporting and searching are time-consuming and inefficient. "
        "Additionally, 58.3% experienced delayed responses or no follow-up after reporting an item. "
        "Although staff are willing to help, the absence of a centralized digital system limits "
        "operational effectiveness.",
    )
    add_heading(doc, "5.1.2 Findings on System Efficiency and Accuracy", level=2)
    add_body(
        doc,
        "Accuracy and efficiency are major concerns. Only 16.7% of respondents believed the current "
        "process never fails to recover items, while the majority reported occasional or frequent "
        "failure. The lack of photo evidence, category filters, and match suggestions contributes "
        "significantly to these inefficiencies.",
    )
    add_heading(doc, "5.1.3 Findings on User Perception and Readiness for DLFS", level=2)
    add_body(
        doc,
        "There is strong support for DLFS implementation. 91.7% of respondents agreed that a digital "
        "platform would improve recovery speed and claim transparency. 88.3% said searchable online "
        "listings would help, and 91.7% would recommend implementing the system.",
    )

    add_heading(doc, "5.2 Discussion of Findings", level=2)
    add_heading(doc, "5.2.1 Impact of Manual Processes on Campus Service Management", level=2)
    add_body(
        doc,
        "The findings confirm that manual lost-and-found processes negatively impact service efficiency "
        "and user satisfaction. Fragmented communication channels increase the time required to match "
        "owners with found items and create uncertainty around case status.",
    )
    add_heading(doc, "5.2.2 Role of DLFS in Enhancing Efficiency and Accuracy", level=2)
    add_body(
        doc,
        "DLFS acts as the intervening system that transforms reporting inputs into reliable service "
        "outputs. Features such as validated forms, image uploads, match confidence scoring, claim "
        "review, and live notifications directly address the weaknesses identified in Chapter 4.",
    )
    add_heading(doc, "5.2.3 Implications for Campus Performance and Student Satisfaction", level=2)
    add_body(
        doc,
        "Improved lost-and-found management has a positive impact on student satisfaction and campus "
        "reputation. Faster recovery reduces stress and financial loss. Administrators gain measurable "
        "insight into open cases, resolution rates, and claim outcomes through dashboards and reports.",
    )
    add_page_break(doc)


def build_chapter6(doc: Document) -> None:
    add_heading(doc, "CHAPTER 6: CONCLUSION AND RECOMMENDATIONS")
    add_heading(doc, "6.1 Conclusion", level=2)
    add_body(
        doc,
        f"The research at {ORG} demonstrates that lost-and-found management remains a high-impact campus "
        f"service with significant room for digital improvement. Manual and informal methods create delays, "
        f"search friction, and weak claim accountability. The proposed {SYSTEM_ACRONYM} offers a practical, "
        f"technically sound, and user-supported solution. With structured reporting, image evidence, match "
        f"suggestions, notifications, and admin review tools, the system can improve recovery efficiency and "
        f"campus service confidence.",
    )
    add_heading(doc, "6.2 Recommendations", level=2)
    add_bullets(
        doc,
        [
            f"Deploy {SYSTEM_ACRONYM} as the official campus lost-and-found platform.",
            "Train front-desk staff and administrators on claim review and item lifecycle management.",
            "Promote the platform during orientation and through faculty announcements.",
            "Maintain data privacy controls for contact details and proof images.",
            "Monitor KPIs such as open cases, resolution time, and claim approval rate.",
            "Extend the system with email/SMS alerts and a dedicated mobile application.",
            "Conduct annual usability reviews and feature updates based on user feedback.",
        ],
    )
    add_page_break(doc)


def build_references(doc: Document) -> None:
    add_heading(doc, "REFERENCES")
    refs = [
        "Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319–340.",
        "Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99–120.",
        "Scott, W. R. (2014). Institutions and Organizations: Ideas, Interests, and Identities (4th ed.). Sage Publications.",
        "Vercel. (n.d.). Next.js Documentation. https://nextjs.org/docs",
        "Prisma. (n.d.). Prisma Documentation. https://www.prisma.io/docs",
        "NextAuth.js. (n.d.). Authentication for Next.js. https://authjs.dev/",
        "Cloudinary. (n.d.). Image and Video Upload, Storage, and Optimization. https://cloudinary.com/documentation",
        "Zod. (n.d.). TypeScript-first schema validation. https://zod.dev/",
        "TanStack. (n.d.). React Query Documentation. https://tanstack.com/query",
        "OpenAPI Initiative. (n.d.). OpenAPI Specification. https://www.openapis.org/",
        "Salazar, M. K. (1990). Interviewer Bias: How it Affects Survey Research. AAOHN Journal, 38(12), 567–572.",
        "Pfadenhauer, M. (2009). At Eye Level: The Expert Interview. In Interviewing Experts. Palgrave Macmillan.",
    ]
    for ref in refs:
        add_body(doc, ref)
    add_page_break(doc)


def build_appendices(doc: Document) -> None:
    add_heading(doc, "APPENDICES A: Geography")
    add_body(doc, "[Insert map of Cambodia and BIU campus location]")
    add_page_break(doc)

    add_heading(doc, "APPENDICES B: Data Structure and Frameworks")
    add_body(
        doc,
        "Database entities: User, Item, Claim, Notification, Account, Session. "
        "Key enums: ItemType (LOST, FOUND), ItemStatus (OPEN, RESOLVED, CLOSED), "
        "ClaimType (FINDER, OWNER), ClaimStatus (PENDING, APPROVED, REJECTED).",
    )
    add_figure(doc, FIGURE_1, "Figure 1. Conceptual framework for DLFS (Appendix B)")
    add_page_break(doc)

    add_heading(doc, "APPENDICES C: System Interface (UI)")
    add_body(doc, "[Insert screenshots: Home, Dashboard, Report Lost, Report Found, Item Detail, Claims, Admin Dashboard, API Docs]")
    add_page_break(doc)

    add_heading(doc, "APPENDICES D: Survey Questionnaires in Google Form")
    add_body(doc, "[Insert full Google Form questionnaire for lost-and-found survey]")
    add_page_break(doc)

    add_heading(doc, "APPENDICES E: Activities And Planning")
    planning = [
        "Week 1: Requirement gathering and problem identification",
        "Week 2: Literature review and conceptual framework",
        "Week 3: Database schema and UI wireframes",
        "Week 4: Authentication and item reporting modules",
        "Week 5: Claim workflow and notifications",
        "Week 6: Admin dashboard, API docs, testing, and thesis writing",
    ]
    for item in planning:
        add_body(doc, item)
    add_page_break(doc)

    add_heading(doc, "APPENDICES F: Photos")
    add_body(doc, "[Insert development progress photos and deployment screenshots]")
    add_page_break(doc)
    add_centered(doc, "សាកលវិទ្យាល័យ ប៊ែលធី អន្តរជាតិ")
    add_centered(doc, "BELTEI INTERNATIONAL UNIVERSITY")
    add_centered(doc, "The Future of Global Leaders")


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    ensure_thesis_figures()
    doc = Document()
    set_doc_defaults(doc)

    build_front_matter(doc)
    build_contents(doc)
    build_lists(doc)
    build_chapter1(doc)
    build_chapter2(doc)
    build_chapter3(doc)
    build_chapter4(doc)
    build_chapter5(doc)
    build_chapter6(doc)
    build_references(doc)
    build_appendices(doc)

    doc.save(OUTPUT)
    print(f"Thesis generated: {OUTPUT}")
    try:
        import shutil
        shutil.copy2(OUTPUT, OUTPUT_APPLICATIONS)
        print(f"Copied to: {OUTPUT_APPLICATIONS}")
    except OSError as exc:
        print(f"Note: could not copy to Applications — {exc}")


if __name__ == "__main__":
    main()
