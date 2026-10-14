-- ====================================================================
-- KIET Campus Navigation Chatbot - SQLite Database Schema
-- Institution: Kakinada Institute of Engineering and Technology (KIET)
-- Location: Korangi, Kakinada District, Andhra Pradesh, India
-- Note: All sample records are clearly marked with is_sample_data = 1
-- ====================================================================

DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Authentication & User Roles)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'faculty', 'visitor')) NOT NULL,
    department TEXT,
    student_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Locations Table (Campus Graph Nodes / Vertices)
CREATE TABLE locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_code TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    building TEXT NOT NULL,
    floor TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    x_coord REAL,
    y_coord REAL,
    nearby_locations TEXT,
    aliases TEXT,
    is_sample_data BOOLEAN DEFAULT 1,
    timings TEXT
);

-- 3. Connections Table (Campus Footpaths / Graph Edges & Weights)
CREATE TABLE connections (
    id TEXT PRIMARY KEY,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    distance REAL NOT NULL,        -- In meters
    estimated_time REAL NOT NULL,  -- In minutes walking
    path_description TEXT,
    FOREIGN KEY(from_location) REFERENCES locations(id),
    FOREIGN KEY(to_location) REFERENCES locations(id)
);

-- 4. Search History Table (Audit log for logged-in user navigation queries)
CREATE TABLE search_history (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    from_location_id TEXT NOT NULL,
    to_location_id TEXT NOT NULL,
    search_query TEXT,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ====================================================================
-- SEED DATA (PROTOTYPE CAMPUS RECORDS)
-- ====================================================================

-- Default Demo Users
INSERT INTO users (id, name, email, password_hash, role, department, student_id) VALUES
('usr-1', 'Aditya Varma', 'student@kiet.edu.in', 'password123', 'student', 'Computer Science & Artificial Intelligence (CAI)', '22B91A4201'),
('usr-2', 'Dr. K. Srinivas Rao', 'faculty@kiet.edu.in', 'password123', 'faculty', 'Computer Science & Engineering (CSE)', NULL),
('usr-3', 'Campus Visitor', 'visitor@kiet.edu.in', 'password123', 'visitor', 'Guest', NULL);

-- Campus Locations (Sample / Prototype Records)
INSERT INTO locations (id, name, short_code, category, description, building, floor, latitude, longitude, x_coord, y_coord, nearby_locations, aliases, is_sample_data, timings) VALUES
('main-gate', 'Main Campus Entrance Gate', 'GATE', 'Other', 'Primary entrance and security checkpoint on Kakinada-Yanam Road, Korangi.', 'Main Security Pavilion', 'Ground Floor', 16.8291, 82.2345, 120, 530, 'Student Parking, Admin Block', 'main gate,entrance,gate,security', 1, 'Open 24/7'),
('parking', 'Student & Staff Vehicle Parking', 'PARK', 'Parking', 'Designated covered two-wheeler and four-wheeler parking bays.', 'East Pavilion Ground', 'Ground Level', 16.8293, 82.2351, 230, 580, 'Main Gate, Admin Block', 'parking,bike parking,car parking,vehicle stand', 1, '7:30 AM - 6:30 PM'),
('admin-block', 'Administrative Office & Principal Chamber', 'ADMIN', 'Administrative', 'Houses Principal Office, Dean Academics, Examination Cell, and Accounts.', 'Sir CV Raman Administrative Block', 'Ground & 1st Floor', 16.8298, 82.2348, 260, 430, 'Main Gate, Library, CSE Block', 'admin,principal office,principal,accounts,exam cell', 1, '9:00 AM - 5:00 PM'),
('central-library', 'Central Knowledge Resource Centre (Library)', 'LIB', 'Library', 'Three-storey library housing 45,000+ technical volumes and IEEE digital access.', 'Dr. Sarvepalli Radhakrishnan Block', 'Ground, 1st & 2nd Floors', 16.8306, 82.2349, 380, 330, 'Admin Block, CSE Block, Auditorium', 'library,central library,reading room,digital library', 1, '8:00 AM - 8:00 PM'),
('cse-dept', 'Computer Science & Engineering (CSE) Department', 'CSE', 'Departments', 'Department of CSE, HOD chamber, senior faculty cabins, and lecture halls.', 'Turing Academic Block A', '1st & 2nd Floors', 16.8312, 82.2356, 520, 260, 'CAI Dept, Computer Labs, Library', 'cse,cse department,computer science,cse block', 1, '9:00 AM - 4:45 PM'),
('cai-dept', 'Computer Science & Artificial Intelligence (CAI) Department', 'CAI', 'Departments', 'Department of CSE (AI & ML), robotics lab, and AI workstation cluster.', 'Ada Lovelace Innovation Wing', '3rd Floor, Turing Block', 16.8315, 82.2361, 640, 210, 'CSE Dept, AI Lab, Computer Labs', 'cai,cai department,artificial intelligence,ai department,ai ml', 1, '9:00 AM - 4:45 PM'),
('computer-lab-1', 'Central Computer Lab 1 & 2 (Lab 3 Complex)', 'LAB-C', 'Laboratories', 'High-speed networked computing laboratories equipped with Intel Core i7 systems.', 'Turing Block Ground Wing', 'Ground Floor', 16.8310, 82.2352, 480, 200, 'CSE Dept, CAI Dept, Library', 'lab 1,lab 2,lab 3,computer lab,programming lab', 1, '9:00 AM - 5:00 PM'),
('ai-lab', 'Advanced AI & IoT Innovation Lab', 'AI-LAB', 'Laboratories', 'Specialized laboratory equipped with GPU rigs for deep learning and IoT sensors.', 'Ada Lovelace Innovation Wing', '3rd Floor (Room 304)', 16.8318, 82.2363, 710, 170, 'CAI Dept, CSE Dept', 'ai lab,iot lab,robotics lab,machine learning lab', 1, '9:30 AM - 5:00 PM'),
('auditorium', 'Dr. APJ Abdul Kalam Auditorium', 'AUDI', 'Student Facilities', 'Air-conditioned 1,200 capacity multipurpose auditorium for campus events.', 'Central Cultural Complex', 'Ground Floor', 16.8301, 82.2338, 230, 280, 'Library, Admin Block, Placement Cell', 'auditorium,audi,seminar hall,kalam audi', 1, 'Events only'),
('placement-cell', 'Training & Placement (T&P) Cell', 'T&P', 'Student Facilities', 'Corporate recruitment suites, group discussion rooms, and interview cabins.', 'Sir CV Raman Block (Annex)', '2nd Floor', 16.8300, 82.2343, 290, 350, 'Admin Block, Library, Auditorium', 'placement,placement cell,tp cell,t&p,training and placement', 1, '9:00 AM - 5:30 PM'),
('canteen', 'Main Campus Canteen & Food Court', 'FOOD', 'Food/Canteen', 'Hygienic multi-cuisine cafeteria serving South Indian breakfast, lunch, and snacks.', 'KIET Food Court & Refreshment Center', 'Ground Floor', 16.8309, 82.2378, 770, 330, 'CAI Dept, Boys Hostel, Sports Ground', 'canteen,cafeteria,mess,food court,cafe,coffee', 1, '7:30 AM - 7:30 PM'),
('sports-ground', 'Campus Cricket Ground & Sports Complex', 'SPORT', 'Sports', 'Standard turf cricket ground, floodlit basketball court, and volleyball court.', 'KIET Physical Education Arena', 'Outdoor Field & Pavilion', 16.8322, 82.2386, 880, 220, 'Main Canteen, Boys Hostel', 'sports,ground,cricket ground,basketball,volleyball', 1, '6:00 AM - 7:00 PM'),
('boys-hostel', 'Boys Campus Residence (Hostel Block)', 'B-HOST', 'Hostel', 'On-campus residential quarters for male students with high-speed Wi-Fi.', 'Swami Vivekananda Residential Block', 'G + 4 Floors', 16.8327, 82.2374, 840, 120, 'Canteen, Sports Ground', 'boys hostel,hostel,boys residence', 1, 'Curfew: 8:30 PM'),
('girls-hostel', 'Girls Campus Residence (Hostel Block)', 'G-HOST', 'Hostel', 'Secure enclosed residential block for female students with 24/7 security.', 'Sarojini Naidu Residential Block', 'G + 3 Floors', 16.8288, 82.2365, 480, 530, 'Main Gate, Admin Block', 'girls hostel,ladies hostel,womens hostel', 1, 'Curfew: 7:00 PM'),
('medical-center', 'Health Centre & First Aid Room', 'MED', 'Other', 'Resident nursing staff, emergency medical aid beds, and standby ambulance.', 'Sir CV Raman Ground Annex', 'Ground Floor', 16.8295, 82.2342, 210, 470, 'Admin Block, Main Gate', 'medical,clinic,dispensary,first aid,doctor,hospital', 1, '9:00 AM - 6:00 PM');

-- Campus Connections (Edges / Pathways with Stored Distance in Meters)
INSERT INTO connections (id, from_location, to_location, distance, estimated_time, path_description) VALUES
('c1', 'main-gate', 'parking', 70, 1.0, 'Take the immediate right lane towards the shaded parking bays.'),
('c2', 'main-gate', 'medical-center', 95, 1.5, 'Walk along the western pedestrian avenue toward the medical annex.'),
('c3', 'main-gate', 'admin-block', 140, 2.0, 'Walk directly north along Central Boulevard toward Administrative Block.'),
('c4', 'main-gate', 'girls-hostel', 210, 3.0, 'Walk along southern perimeter avenue eastward to Girls Residence gate.'),
('c5', 'admin-block', 'placement-cell', 85, 1.0, 'Proceed up to the 2nd Floor annex of CV Raman Block.'),
('c6', 'admin-block', 'auditorium', 130, 2.0, 'Walk northwest past fountain court toward Dr. APJ Abdul Kalam Auditorium.'),
('c7', 'admin-block', 'central-library', 120, 1.8, 'Proceed north past the central circle; Central Library entrance faces you.'),
('c8', 'admin-block', 'canteen', 220, 2.8, 'Follow eastern walkway past central lawns toward Main Campus Canteen.'),
('c9', 'central-library', 'cse-dept', 110, 1.5, 'Walk northeast across paved courtyard into Turing Academic Block.'),
('c10', 'central-library', 'computer-lab-1', 95, 1.2, 'Proceed north into Ground Floor wing of Turing Academic Block.'),
('c11', 'cse-dept', 'cai-dept', 80, 1.0, 'Ascend to 3rd Floor of Turing Block via central stairs to Ada Lovelace Wing.'),
('c12', 'cai-dept', 'ai-lab', 40, 0.5, 'Walk down 3rd floor north hallway to Room 304 (AI & IoT Innovation Lab).'),
('c13', 'cse-dept', 'canteen', 180, 2.2, 'Walk southeast along main avenue towards Food Court.'),
('c17', 'canteen', 'sports-ground', 140, 2.0, 'Walk northeast past pavilion to main sports field and cricket pitch.'),
('c18', 'canteen', 'boys-hostel', 160, 2.2, 'Follow northern residential walkway towards Swami Vivekananda Hostel.'),
('c19', 'sports-ground', 'boys-hostel', 110, 1.5, 'Walk westward from sports pavilion boundary to boys hostel gate.'),
('c20', 'auditorium', 'central-library', 140, 2.0, 'Exit auditorium lobby and walk east across central lawn to library.'),
('c21', 'computer-lab-1', 'cse-dept', 50, 0.8, 'Take central stairs up one flight to 1st Floor CSE Department.');
