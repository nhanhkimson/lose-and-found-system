import { PrismaClient } from "@prisma/client";
import type { ItemCategory, ItemStatus, ItemType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

function atDaysAgo(days: number, hour = 12) {
  return new Date(subDays(new Date(), days).setHours(hour, 30, 0, 0));
}

const PASSWORD = "Password123!";

type SeedUser = {
  email: string;
  name: string;
  role: "ADMIN" | "STUDENT";
  studentId: string;
};

const USERS: SeedUser[] = [
  { email: "sotha.phearom@biu.edu.kh", name: "Sotha Phearom", role: "ADMIN", studentId: "ADM-2024-001" },
  { email: "chiva.sopheap@biu.edu.kh", name: "Chiva Sopheap", role: "ADMIN", studentId: "ADM-2024-002" },
  { email: "sok.sopheak.student@biu.edu.kh", name: "Sok Sopheak", role: "STUDENT", studentId: "STU-2023-1042" },
  { email: "ly.vannak.student@biu.edu.kh", name: "Ly Vannak", role: "STUDENT", studentId: "STU-2024-0118" },
  { email: "srey.sothea.student@biu.edu.kh", name: "Srey Sothea", role: "STUDENT", studentId: "STU-2023-0891" },
  { email: "nhem.pisey.student@biu.edu.kh", name: "Nhem Pisey", role: "STUDENT", studentId: "STU-2024-0204" },
  { email: "heng.sina.student@biu.edu.kh", name: "Heng Sina", role: "STUDENT", studentId: "STU-2023-1305" },
];

type SeedRow = {
  type: ItemType;
  status: ItemStatus;
  title: string;
  description: string;
  category: ItemCategory;
  building: string;
  roomHint?: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  eventDate: Date;
  /** Index into created user list (students + admins) */
  ownerIndex: number;
};

const rows: SeedRow[] = [
  {
    type: "LOST",
    status: "OPEN",
    title: "Silver MacBook Air (stickers on lid)",
    description:
      "13-inch, space gray, small dent near the trackpad. BIU debate club stickers on the lid. Last seen after data structures lecture near the IT lab.",
    category: "ELECTRONICS",
    building: "IT & Innovation Lab",
    roomHint: "Lab 201",
    contactName: "Sok Sopheak",
    contactEmail: "sok.sopheak.student@biu.edu.kh",
    eventDate: atDaysAgo(3, 16),
    ownerIndex: 2,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Wireless mouse (Logitech)",
    description:
      "Black Logitech mouse left on a shared desk; no visible name. Turned in at the front counter of the library.",
    category: "ELECTRONICS",
    building: "Library & Learning Center",
    roomHint: "Level 2 study zone",
    contactName: "Ly Vannak",
    contactEmail: "ly.vannak.student@biu.edu.kh",
    eventDate: atDaysAgo(8, 18),
    ownerIndex: 3,
  },
  {
    type: "LOST",
    status: "RESOLVED",
    title: "Student ID card (laminated, name starting with P.)",
    description:
      "Blue lanyard with a bent ID; may have been dropped near the printer area. Security number partially visible as 2023****. Owner collected after match.",
    category: "DOCUMENTS",
    building: "Main Block A (Administration & Classes)",
    roomHint: "Ground floor corridor",
    contactName: "Srey Sothea",
    contactPhone: "+855 12 345 678",
    eventDate: atDaysAgo(1, 9),
    ownerIndex: 4,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Passport-size photo sheet (4 photos)",
    description: "Found between two chairs; no names on the strip. Kept at room 105 for two weeks.",
    category: "DOCUMENTS",
    building: "Science & Language Block",
    roomHint: "Room 105",
    contactName: "Chea Ratanak",
    contactEmail: "chea.ratanak.student@biu.edu.kh",
    eventDate: atDaysAgo(19, 14),
    ownerIndex: 2,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "Dorm key with red keychain (Block B)",
    description: "Single metal key on a red silicone keychain with a small elephant charm.",
    category: "KEYS",
    building: "Dormitory West (Student Housing)",
    roomHint: "Near laundry room",
    contactName: "Nhem Pisey",
    contactEmail: "nhem.pisey.student@biu.edu.kh",
    eventDate: atDaysAgo(5, 20),
    ownerIndex: 5,
  },
  {
    type: "FOUND",
    status: "CLOSED",
    title: "Car key fob (Toyota)",
    description:
      "Found in the west parking lot; label partially worn. Item was returned; listing closed by security.",
    category: "KEYS",
    building: "Student Center & Cafeteria",
    roomHint: "Reception",
    contactName: "Heng Sina",
    contactEmail: "heng.sina.student@biu.edu.kh",
    eventDate: atDaysAgo(15, 7),
    ownerIndex: 6,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "Black UNIQLO windbreaker (size M)",
    description: "Lightweight shell jacket, small coffee stain on left sleeve. Left on chair after club meeting.",
    category: "CLOTHING",
    building: "Student Center & Cafeteria",
    roomHint: "Meeting area",
    contactName: "Tep Serey",
    contactPhone: "+855 11 900 456",
    eventDate: atDaysAgo(2, 17),
    ownerIndex: 3,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Gray beanie (hand-knit pattern)",
    description: "Soft wool feel; found on a bench by the main stairs of the engineering block.",
    category: "CLOTHING",
    building: "Engineering & Tech Building",
    roomHint: "Stairwell B",
    contactName: "Sam Vicheka",
    contactEmail: "sam.vicheka.student@biu.edu.kh",
    eventDate: atDaysAgo(11, 10),
    ownerIndex: 4,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "Advanced Accounting textbook (latest edition)",
    description:
      "Hardcover with yellow highlighter tab on chapter 4. Name written in Khmer and English on first page: ‘Sovann S.’",
    category: "BOOKS",
    building: "Main Block B (Faculty of Business)",
    roomHint: "Room 310",
    contactName: "Ouk Borey",
    contactEmail: "ouk.borey.student@biu.edu.kh",
    eventDate: atDaysAgo(6, 8),
    ownerIndex: 5,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Thick A4 ring binder (green)",
    description: "Contains printed lecture notes for statistics; cover page with doodles, no last name on cover.",
    category: "BOOKS",
    building: "Library & Learning Center",
    roomHint: "Group study pod 3",
    contactName: "Lim Chantha",
    contactPhone: "+855 69 200 800",
    eventDate: atDaysAgo(9, 15),
    ownerIndex: 6,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "Silver bracelet (floral engraving)",
    description: "Family gift; may have come off after PE class. Very sentimental; reward offered in person.",
    category: "ACCESSORIES",
    building: "Sports Complex & Gymnasium",
    roomHint: "Changing room area",
    contactName: "Khem Srey Mom",
    contactEmail: "khem.sreymom.student@biu.edu.kh",
    eventDate: atDaysAgo(4, 18),
    ownerIndex: 2,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Wristwatch (analog, leather strap, brown)",
    description: "Found near water fountain, glass slightly scratched. Handed to security desk in Block A.",
    category: "ACCESSORIES",
    building: "Main Block A (Administration & Classes)",
    roomHint: "Security front desk",
    contactName: "Pich Chhay Kim",
    contactEmail: "pich.kim.student@biu.edu.kh",
    eventDate: atDaysAgo(22, 12),
    ownerIndex: 3,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "Badminton racket (Yonex, blue grip)",
    description: "Carrying bag missing. Last used during inter-faculty practice at the sports hall.",
    category: "SPORTS",
    building: "Sports Complex & Gymnasium",
    roomHint: "Court 2",
    contactName: "Rous Panha",
    contactPhone: "+855 97 000 120",
    eventDate: atDaysAgo(7, 19),
    ownerIndex: 4,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Two badminton shuttles (plastic, mixed colors)",
    description: "Left in the equipment bin after open hours; if yours, describe brand and color when claiming.",
    category: "SPORTS",
    building: "Sports Complex & Gymnasium",
    roomHint: "Equipment desk",
    contactName: "Sann Sovann",
    contactEmail: "sann.sovann.student@biu.edu.kh",
    eventDate: atDaysAgo(27, 17),
    ownerIndex: 5,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "Metal ruler set and compass (blue mesh pouch)",
    description: "Blue zip mesh pouch; a small BIU keychain attached to the zipper pull.",
    category: "STATIONERY",
    building: "Science & Language Block",
    roomHint: "Tutorial room 12",
    contactName: "Mao Channan",
    contactEmail: "mao.channan.student@biu.edu.kh",
    eventDate: atDaysAgo(10, 9),
    ownerIndex: 6,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Pack of gel pens + one black marker",
    description: "Found under a table after evening class; unlabeled transparent pencil case.",
    category: "STATIONERY",
    building: "Engineering & Tech Building",
    roomHint: "Room 102",
    contactName: "Puth Dararith",
    contactPhone: "+855 85 300 100",
    eventDate: atDaysAgo(13, 20),
    ownerIndex: 2,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "Black Jansport backpack (USB patch on strap)",
    description:
      "Contains charging cables, power bank, and a small pencil pouch. Urgent: exam notes were inside a green folder.",
    category: "BAGS",
    building: "Dormitory East (Student Housing)",
    roomHint: "Common room TV area",
    contactName: "Soun Visal",
    contactEmail: "soun.visal.student@biu.edu.kh",
    eventDate: atDaysAgo(0, 19),
    ownerIndex: 3,
  },
  {
    type: "FOUND",
    status: "OPEN",
    title: "Navy laptop sleeve (15 inch)",
    description: "No device inside. Clean condition; a tiny ink dot on a corner.",
    category: "BAGS",
    building: "IT & Innovation Lab",
    roomHint: "Outside Lab 201",
    contactName: "Kong Panharith",
    contactEmail: "kong.panharith.student@biu.edu.kh",
    eventDate: atDaysAgo(17, 16),
    ownerIndex: 4,
  },
  {
    type: "LOST",
    status: "OPEN",
    title: "USB-C to HDMI adapter (Anker)",
    description: "Needed for a presentation. Likely left on a podium in the auditorium area.",
    category: "OTHER",
    building: "Main Block A (Administration & Classes)",
    roomHint: "Auditorium (upper gallery)",
    contactName: "Khat Virakboth",
    contactPhone: "+855 76 100 200",
    eventDate: atDaysAgo(12, 11),
    ownerIndex: 5,
  },
  {
    type: "FOUND",
    status: "RESOLVED",
    title: "Umbrella (black, three-fold) with a loose spoke",
    description: "Left in umbrella stand on a rainy day; returned to a student who described it correctly.",
    category: "OTHER",
    building: "Student Center & Cafeteria",
    roomHint: "Entrance A",
    contactName: "Nget Voleak",
    contactEmail: "nget.voleak.student@biu.edu.kh",
    eventDate: atDaysAgo(29, 8),
    ownerIndex: 6,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  await prisma.notification.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.item.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers: { id: string; email: string; role: string }[] = [];
  for (const u of USERS) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        role: u.role,
        studentId: u.studentId,
        password: passwordHash,
      },
    });
    createdUsers.push({ id: user.id, email: user.email ?? u.email, role: u.role });
  }

  const userIds = createdUsers.map((c) => c.id);

  const itemIds: string[] = [];
  for (const row of rows) {
    const userId = userIds[row.ownerIndex] ?? userIds[0];
    const it = await prisma.item.create({
      data: {
        userId,
        type: row.type,
        status: row.status,
        title: row.title,
        description: row.description,
        category: row.category,
        building: row.building,
        roomHint: row.roomHint,
        contactName: row.contactName,
        contactEmail: row.contactEmail,
        contactPhone: row.contactPhone,
        eventDate: row.eventDate,
        timeApprox: row.type === "LOST" ? "Afternoon" : null,
        foundDisposition: row.type === "FOUND" ? "STILL_HAVE" : null,
        notifyOnMatch: true,
        allowContact: true,
      },
    });
    itemIds.push(it.id);
  }

  // Sample claims: pending on first open found item, approved tied to resolved item (first RESOLVED in list: index 2)
  const [claimerA, claimerB] = [createdUsers[2]!, createdUsers[3]!];
  const foundOpenItem = rows.findIndex((r) => r.type === "FOUND" && r.status === "OPEN");
  if (foundOpenItem >= 0) {
    await prisma.claim.create({
      data: {
        itemId: itemIds[foundOpenItem]!,
        userId: claimerA.id,
        type: "OWNER",
        message:
          "I think this is my Logitech mouse — I can describe a small scratch on the underside. I can pick it up this week at the library front desk after my classes.",
        status: "PENDING",
        proofImageUrls: [],
      },
    });
  }

  const resolvedIdx = rows.findIndex((r) => r.status === "RESOLVED");
  if (resolvedIdx >= 0) {
    await prisma.claim.create({
      data: {
        itemId: itemIds[resolvedIdx]!,
        userId: claimerB.id,
        type: "FINDER",
        message:
          "I am the one who found this ID. Thank you for contacting me; I am glad it went back to the correct student.",
        status: "APPROVED",
        proofImageUrls: [],
        reviewedAt: atDaysAgo(0, 10),
        adminNote: "Verified in person with security.",
      },
    });
  }

  const rejectedItemIdx = rows.findIndex((r) => r.title.includes("Yonex"));
  if (rejectedItemIdx >= 0) {
    await prisma.claim.create({
      data: {
        itemId: itemIds[rejectedItemIdx]!,
        userId: createdUsers[5]!.id,
        type: "OWNER",
        message: "Claiming as mine — wrong model when checked at office.",
        status: "REJECTED",
        adminNote: "Racket model did not match description on file.",
        reviewedAt: atDaysAgo(1, 14),
        proofImageUrls: [],
      },
    });
  }

  console.log("Seed complete.");
  console.log("Users (password for all):", PASSWORD);
  for (const u of USERS) {
    console.log(`  - ${u.role}: ${u.email}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
