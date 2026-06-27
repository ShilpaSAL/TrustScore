import { useState } from "react";

export default function JobSeekerProfile() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        education: "",
        experience: "",
        skills: "",
        coverLetter: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [resume, setResume] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(form);
        console.log(profileImage);
        console.log(resume);

        alert("Profile Saved Successfully!");
    };

    return (
        <div className="max-w-5xl mx-auto p-8">

            <div className="bg-slate-900 rounded-3xl border border-slate-700 p-8">

                <h1 className="text-3xl font-bold text-white mb-8">
                    Job Seeker Profile
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Profile Photo */}

                    <div>

                        <label className="text-white block mb-2">
                            Profile Photo
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setProfileImage(e.target.files[0])
                            }
                            className="text-white"
                        />

                    </div>

                    {/* Name */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    {/* Email */}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    {/* Phone */}

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    {/* Location */}

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    {/* Education */}

                    <textarea
                        name="education"
                        placeholder="Education"
                        value={form.education}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    {/* Experience */}

                    <textarea
                        name="experience"
                        placeholder="Experience"
                        value={form.experience}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    {/* Skills */}

                    <textarea
                        name="skills"
                        placeholder="Skills"
                        value={form.skills}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    {/* Resume */}

                    <div>

                        <label className="text-white block mb-2">
                            Resume
                        </label>

                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                                setResume(e.target.files[0])
                            }
                            className="text-white"
                        />

                    </div>

                    {/* Cover Letter */}

                    <textarea
                        name="coverLetter"
                        placeholder="Cover Letter"
                        value={form.coverLetter}
                        onChange={handleChange}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl"
                    />

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl text-white font-semibold"
                    >
                        Save Profile
                    </button>

                </form>

            </div>

        </div>
    );
}