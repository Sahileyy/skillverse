import prisma from "../lib/prisma";
import { hashPassword, comparePassword, signJWT, verifyJWT } from "../lib/auth";
import { registerSchema, loginSchema } from "../lib/validations/auth";

async function testBackend() {
  console.log("========================================");
  console.log("🚀 STARTING BACKEND TESTS AGAINST NEON DB");
  console.log("========================================\n");

  // 1. Test Database Connectivity
  console.log("1️⃣ Testing Database Connection...");
  const userCount = await prisma.user.count();
  console.log(`✅ Neon DB Connected successfully! Current user count: ${userCount}\n`);

  // 2. Test Zod Schemas Validation
  console.log("2️⃣ Testing Zod Validation...");
  const validRegister = registerSchema.safeParse({
    name: "Alex Mentor",
    email: "alex.mentor@test.com",
    password: "securepassword123",
    role: "MENTOR",
  });
  if (!validRegister.success) throw new Error("Zod validation failed on valid input");

  const invalidRegister = registerSchema.safeParse({
    name: "A",
    email: "not-an-email",
    password: "123",
    role: "INVALID_ROLE",
  });
  if (invalidRegister.success) throw new Error("Zod should have rejected invalid input");
  console.log("✅ Zod Schemas validating inputs correctly!\n");

  // 3. Test Password Hashing
  console.log("3️⃣ Testing Password Hashing & Verification...");
  const rawPass = "MySecretPass123!";
  const hashed = await hashPassword(rawPass);
  const isMatch = await comparePassword(rawPass, hashed);
  const isWrongMatch = await comparePassword("WrongPass", hashed);
  if (!isMatch || isWrongMatch) throw new Error("Password hashing verification failed");
  console.log("✅ Password hashing (bcryptjs) working properly!\n");

  // 4. Test JWT Signing and Verification
  console.log("4️⃣ Testing JWT Signing & Verification...");
  const mockPayload = {
    id: "test-user-id",
    email: "alex.mentor@test.com",
    name: "Alex Mentor",
    role: "MENTOR" as const,
  };
  const token = await signJWT(mockPayload);
  const verified = await verifyJWT(token);
  if (!verified || verified.email !== mockPayload.email || verified.role !== "MENTOR") {
    throw new Error("JWT verification failed");
  }
  console.log("✅ JWT signing and verification (jose) working properly!\n");

  // 5. Test Database User & Profile CRUD
  console.log("5️⃣ Testing User & Profile CRUD in Neon DB...");
  const testEmail = `mentor_${Date.now()}@skillverse.dev`;
  const studentEmail = `student_${Date.now()}@skillverse.dev`;

  // Create Mentor
  const mentor = await prisma.user.create({
    data: {
      name: "Prof. Alan Turing",
      email: testEmail,
      passwordHash: hashed,
      role: "MENTOR",
      profile: {
        create: {
          headline: "Computer Science & Python Expert",
          bio: "Passionate about algorithms and problem solving.",
          timezone: "UTC",
        },
      },
    },
    include: { profile: true },
  });
  console.log(`✅ Created Mentor User: ${mentor.name} (${mentor.email}) with Profile ID: ${mentor.profile?.id}`);

  // Create Student
  const student = await prisma.user.create({
    data: {
      name: "Ada Lovelace",
      email: studentEmail,
      passwordHash: hashed,
      role: "STUDENT",
      profile: {
        create: {
          headline: "Aspiring Software Engineer",
        },
      },
    },
  });
  console.log(`✅ Created Student User: ${student.name} (${student.email})`);

  // 6. Test Mentor Post Creation
  console.log("\n6️⃣ Testing Mentor Skill Post Creation...");
  const post = await prisma.post.create({
    data: {
      userId: mentor.id,
      skillName: "Python",
      category: "Programming",
      title: "Mastering Data Structures in Python",
      description: "Comprehensive 1-on-1 tutoring on Trees, Graphs, and Dynamic Programming.",
      pricingType: "FREE",
      availability: "Weekends 10 AM - 2 PM",
    },
  });
  console.log(`✅ Created Post: "${post.title}" for Skill: ${post.skillName} (ID: ${post.id})`);

  // 7. Test Direct Skill Search Query
  console.log("\n7️⃣ Testing Direct Skill Search (Filter by 'Python')...");
  const searchResults = await prisma.post.findMany({
    where: {
      skillName: { contains: "Python", mode: "insensitive" },
      status: "ACTIVE",
    },
    include: { user: { select: { name: true, role: true } } },
  });
  console.log(`✅ Found ${searchResults.length} active post(s) matching 'Python'`);

  // 8. Test Session Booking Flow
  console.log("\n8️⃣ Testing Session Booking Flow...");
  const booking = await prisma.booking.create({
    data: {
      postId: post.id,
      studentId: student.id,
      mentorId: mentor.id,
      status: "PENDING",
      scheduledAt: new Date(Date.now() + 86400000), // tomorrow
    },
  });
  console.log(`✅ Created Booking Request: Student (${student.name}) -> Mentor (${mentor.name}) Status: ${booking.status}`);

  // Accept booking
  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "ACCEPTED", meetingUrl: "https://meet.google.com/abc-defg-hij" },
  });
  console.log(`✅ Updated Booking: Status: ${updatedBooking.status}, Meeting: ${updatedBooking.meetingUrl}`);

  // 9. Test Community Project & Join Request
  console.log("\n9️⃣ Testing Community Project & Join Request Flow...");
  const project = await prisma.projectPost.create({
    data: {
      userId: mentor.id,
      title: "Open Source AI Study Group",
      description: "Building a collaborative LLM tool for college students.",
      skillsNeeded: ["React", "TypeScript", "Python"],
      contactInfo: "discord: @alanturing",
    },
  });
  const joinReq = await prisma.projectJoinRequest.create({
    data: {
      projectId: project.id,
      studentId: student.id,
      message: "I would love to contribute to the React frontend!",
      status: "PENDING",
    },
  });
  console.log(`✅ Created Project Post "${project.title}" and Join Request ID: ${joinReq.id}`);

  // 10. Clean up test records
  console.log("\n🧹 Cleaning up test records from database...");
  await prisma.user.deleteMany({
    where: { id: { in: [mentor.id, student.id] } },
  });
  console.log("✅ Cleanup complete!");

  console.log("\n========================================");
  console.log("🎉 ALL BACKEND CHECKS PASSED 100%!");
  console.log("========================================");
}

testBackend()
  .catch((err) => {
    console.error("\n❌ Backend Test Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
