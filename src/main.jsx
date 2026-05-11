import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Bot, BrainCircuit, BriefcaseBusiness, CheckCircle2, ChevronUp, Clock, ExternalLink, GraduationCap, Home, Search, Sparkles, Star, Target, Users } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/courses';

const interestOptions = ['llm', 'rag', 'mcp', 'nlp', 'ml', 'agents', 'fine-tuning', 'automation', 'evaluation', 'responsible ai'];
const goalOptions = ['learn fundamentals', 'build ai apps', 'ship production systems', 'change career', 'automate work', 'lead ai strategy', 'research', 'increase productivity'];
const priceOptions = ['All prices', 'Free', 'Subscription', 'Paid', 'Exam fee'];
const careerPaths = [
  {
    title: 'AI Engineer',
    icon: <Bot />,
    description: 'AI Engineers build practical AI-powered products such as chatbots, copilots, RAG systems, agent workflows, and automation tools.',
    skills: ['llm', 'rag', 'agents', 'openai', 'evaluation', 'python'],
    roles: ['software engineer', 'ai engineer'],
    goals: ['build ai apps', 'ship production systems'],
  },
  {
    title: 'Machine Learning Engineer',
    icon: <BrainCircuit />,
    description: 'Machine Learning Engineers train, evaluate, deploy, and monitor ML models in production systems.',
    skills: ['ml', 'deep learning', 'pytorch', 'tensorflow', 'mlops', 'feature engineering'],
    roles: ['ml engineer', 'software engineer'],
    goals: ['ship production systems', 'build ai apps'],
  },
  {
    title: 'Data Scientist',
    icon: <Target />,
    description: 'Data Scientists use statistics, machine learning, experimentation, and communication to turn data into decisions and predictive models.',
    skills: ['data science', 'ml', 'python', 'kaggle', 'explainability', 'model evaluation'],
    roles: ['data scientist', 'data analyst'],
    goals: ['change career', 'research'],
  },
  {
    title: 'NLP Engineer',
    icon: <Search />,
    description: 'NLP Engineers specialize in language systems including transformers, classification, semantic search, embeddings, and text generation.',
    skills: ['nlp', 'transformers', 'hugging face', 'semantic search', 'fine tuning'],
    roles: ['ml engineer', 'ai engineer'],
    goals: ['build ai apps', 'research'],
  },
  {
    title: 'AI Product Manager',
    icon: <BriefcaseBusiness />,
    description: 'AI Product Managers translate AI capabilities into valuable products, define metrics, manage risk, and guide cross-functional teams.',
    skills: ['product', 'ai strategy', 'responsible ai', 'generative ai', 'business'],
    roles: ['product manager', 'founder', 'leader'],
    goals: ['lead ai strategy', 'understand ai business'],
  },
  {
    title: 'MLOps Engineer',
    icon: <Clock />,
    description: 'MLOps Engineers build the infrastructure for reliable ML delivery, including pipelines, deployment, monitoring, and cloud operations.',
    skills: ['mlops', 'aws', 'azure', 'google cloud', 'model evaluation', 'certification'],
    roles: ['ml engineer', 'software engineer'],
    goals: ['ship production systems', 'change career'],
  },
  {
    title: 'AI Researcher',
    icon: <GraduationCap />,
    description: 'AI Researchers explore new model architectures, training methods, evaluation approaches, and scientific applications of AI.',
    skills: ['deep learning', 'research', 'transformers', 'reinforcement learning', 'pytorch'],
    roles: ['researcher', 'ml engineer'],
    goals: ['research', 'learn fundamentals'],
  },
  {
    title: 'AI Automation Specialist',
    icon: <Sparkles />,
    description: 'AI Automation Specialists use AI tools, agents, APIs, and workflow platforms to automate repetitive business and knowledge work.',
    skills: ['automation', 'agents', 'prompting', 'chatbots', 'workflow'],
    roles: ['automation specialist', 'operations', 'marketer'],
    goals: ['automate work', 'increase productivity'],
  },
];

function App() {
  const [courses, setCourses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationMessage, setRecommendationMessage] = useState('Tell us about your background to unlock recommendations tailored to your AI journey.');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All prices');
  const [selectedPath, setSelectedPath] = useState(careerPaths[0]);
  const [visibleCourseCount, setVisibleCourseCount] = useState(12);
  const [draftSearchQuery, setDraftSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    experience: 'Beginner / new to AI',
    jobRole: 'Software Engineer',
    interests: ['llm', 'rag'],
    goals: ['build ai apps'],
    learningStyle: 'Project-based',
    weeklyHours: 5,
  });

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then(setCourses)
      .catch(() => setRecommendationMessage('Start the Java backend to load live course data and recommendations.'));
  }, []);

  const categories = useMemo(() => ['All', ...new Set(courses.map((course) => course.category))], [courses]);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const displayedCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesPrice = selectedPrice === 'All prices'
      || course.price.toLowerCase().includes(selectedPrice.toLowerCase())
      || (selectedPrice === 'Paid' && course.price.startsWith('$'));
    const searchableText = [
      course.title,
      course.subtitle,
      course.category,
      course.provider,
      course.instructor,
      course.level,
      course.price,
      course.highlight,
      ...course.tags,
      ...course.roles,
      ...course.goals,
    ].join(' ').toLowerCase();
    const matchesSearch = normalizedSearchQuery === '' || searchableText.includes(normalizedSearchQuery);
    return matchesCategory && matchesPrice && matchesSearch;
  });
  const visibleCourses = displayedCourses.slice(0, visibleCourseCount);
  const hasMoreCourses = visibleCourseCount < displayedCourses.length;
  const heroCourses = recommendations.length > 0 ? recommendations : courses.slice(0, 6);
  const careerCourses = useMemo(() => courses
    .map((course) => ({
      course,
      score: [
        ...course.tags,
        ...course.roles,
        ...course.goals,
        course.title,
        course.subtitle,
        course.category,
      ].reduce((total, value) => {
        const normalized = value.toLowerCase();
        const skillScore = selectedPath.skills.some((skill) => normalized.includes(skill)) ? 4 : 0;
        const roleScore = selectedPath.roles.some((role) => normalized.includes(role)) ? 3 : 0;
        const goalScore = selectedPath.goals.some((goal) => normalized.includes(goal)) ? 3 : 0;
        return total + skillScore + roleScore + goalScore;
      }, 0),
    }))
    .sort((a, b) => b.score - a.score || b.course.rating - a.course.rating)
    .slice(0, 6)
    .map(({ course }) => course), [courses, selectedPath]);

  const updateMultiSelect = (field, value) => {
    setProfile((current) => {
      const exists = current[field].includes(value);
      return {
        ...current,
        [field]: exists ? current[field].filter((item) => item !== value) : [...current[field], value],
      };
    });
  };

  const getRecommendations = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      setRecommendations(data.courses);
      setRecommendationMessage(data.message);
    } catch {
      setRecommendationMessage('Could not reach the recommendation API. Please make sure the Spring Boot backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const nextQuery = draftSearchQuery.trim();
    setSearchQuery(nextQuery);
    setSelectedCategory('All');
    setSelectedPrice('All prices');
    setVisibleCourseCount(12);
    window.setTimeout(() => {
      document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const clearSearch = () => {
    setDraftSearchQuery('');
    setSearchQuery('');
    setVisibleCourseCount(12);
  };

  return (
    <main>
      <section className="hero" id="home">
        <nav className="nav">
          <a className="brand" href="#home"><BrainCircuit size={30} /> AICademy</a>
          <div className="nav-links">
            <a href="#home"><Home size={16} /> Home</a>
            <a href="#courses">Courses</a>
            <a href="#personalize">Personalize</a>
            <a href="#paths">Career Paths</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={16} /> AI-first learning marketplace</div>
            <h1>Master practical AI skills.</h1>
            <p>Discover practical, job-relevant AI courses with recommendations shaped by your experience, interests, career goals, role, and weekly learning time.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#personalize">Get my AI course path <ArrowRight size={18} /></a>
              <a className="secondary-button" href="#courses">Browse courses</a>
            </div>
            <div className="stats">
              <span><strong>500</strong> real options</span>
              <span><strong>4.7+</strong> average rating</span>
              <span><strong>Top</strong> providers</span>
            </div>
          </div>

          <div className="hero-card">
            <form className="search-form" onSubmit={submitSearch}>
              <label className="search-box" htmlFor="course-search">
                <Search size={18} />
                <input
                  id="course-search"
                  value={draftSearchQuery}
                  onChange={(event) => setDraftSearchQuery(event.target.value)}
                  placeholder="Search LLM agents, RAG, MCP, NLP..."
                />
              </label>
              <div className="search-actions">
                <button type="submit">Search</button>
                {(draftSearchQuery || searchQuery) && <button type="button" className="ghost-search-button" onClick={clearSearch}>Clear</button>}
              </div>
            </form>
            {heroCourses.slice(0, 3).map((course) => <MiniCourse key={course.id} course={course} />)}
          </div>
        </div>
      </section>

      <section className="section" id="personalize">
        <div className="section-heading">
          <span className="eyebrow"><Target size={16} /> Recommended context</span>
          <h2>Answer a few questions so courses match your real situation.</h2>
          <p>{recommendationMessage}</p>
        </div>

        <form className="profile-panel" onSubmit={getRecommendations}>
          <div className="form-grid">
            <label>Experience level
              <select value={profile.experience} onChange={(event) => setProfile({ ...profile, experience: event.target.value })}>
                <option>Beginner / new to AI</option>
                <option>Some AI or data experience</option>
                <option>Advanced / building production AI</option>
              </select>
            </label>
            <label>Current role or job
              <input value={profile.jobRole} onChange={(event) => setProfile({ ...profile, jobRole: event.target.value })} placeholder="Software Engineer, Product Manager, Student..." />
            </label>
            <label>Learning style
              <select value={profile.learningStyle} onChange={(event) => setProfile({ ...profile, learningStyle: event.target.value })}>
                <option>Project-based</option>
                <option>Theory-first</option>
                <option>Career-focused</option>
                <option>Short practical lessons</option>
              </select>
            </label>
            <label>Hours per week
              <input type="number" min="1" max="40" value={profile.weeklyHours} onChange={(event) => setProfile({ ...profile, weeklyHours: Number(event.target.value) })} />
            </label>
          </div>

          <ChoiceGroup title="AI topics you prefer" values={interestOptions} selected={profile.interests} onToggle={(value) => updateMultiSelect('interests', value)} />
          <ChoiceGroup title="Your main goals" values={goalOptions} selected={profile.goals} onToggle={(value) => updateMultiSelect('goals', value)} />

          <button className="primary-button submit" type="submit" disabled={loading}>{loading ? 'Finding your path...' : 'Recommend courses'} <Sparkles size={18} /></button>
        </form>

        {recommendations.length > 0 && <CourseGrid courses={recommendations} title="Your personalized AI learning path" />}
      </section>

      <section className="section" id="courses">
        <div className="section-heading row">
          <div>
            <span className="eyebrow"><GraduationCap size={16} /> Course marketplace</span>
            <h2>Explore focused AI courses</h2>
            {searchQuery && <p>Filtered search results for “{searchQuery}” across all courses</p>}
            {searchQuery && <button className="inline-clear-button" onClick={clearSearch}>Clear search</button>}
          </div>
          <div className="filter-stack">
            <div className="tabs">{categories.map((category) => <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => { setSelectedCategory(category); setVisibleCourseCount(12); }}>{category}</button>)}</div>
            <div className="tabs price-tabs">{priceOptions.map((price) => <button key={price} className={selectedPrice === price ? 'active' : ''} onClick={() => { setSelectedPrice(price); setVisibleCourseCount(12); }}>{price}</button>)}</div>
          </div>
        </div>
        {visibleCourses.length > 0 ? <CourseGrid courses={visibleCourses} /> : <div className="empty-state">No courses match your search and filters. Try another keyword or reset filters.</div>}
        <div className="course-actions">
          <span>Showing {visibleCourses.length} of {displayedCourses.length} matching courses</span>
          {displayedCourses.length > 12 && (
            <button className="secondary-dark-button" onClick={() => setVisibleCourseCount(hasMoreCourses ? visibleCourseCount + 12 : 12)}>
              {hasMoreCourses ? 'Show more courses' : 'Show less'}
            </button>
          )}
        </div>
      </section>

      <section className="section" id="paths">
        <div className="section-heading">
          <span className="eyebrow"><BriefcaseBusiness size={16} /> Career paths</span>
          <h2>Choose an AI job path</h2>
          <p>Click a career card to see what the role does and which courses can help you prepare for it.</p>
        </div>
        <div className="career-layout">
          <div className="paths">
            {careerPaths.map((path) => <Path key={path.title} path={path} selected={selectedPath.title === path.title} onSelect={() => setSelectedPath(path)} />)}
          </div>
          <div className="career-detail">
            <div className="detail-title">{selectedPath.icon}<h3>{selectedPath.title}</h3></div>
            <p>{selectedPath.description}</p>
            <h4>Skills to build</h4>
            <div className="tags">{selectedPath.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <CourseGrid courses={careerCourses} title={`Recommended courses for ${selectedPath.title}`} />
          </div>
        </div>
      </section>
      <a className="back-to-top" href="#home" aria-label="Back to top"><ChevronUp size={22} /></a>
    </main>
  );
}

function ChoiceGroup({ title, values, selected, onToggle }) {
  return (
    <div className="choice-group">
      <h3>{title}</h3>
      <div className="chips">
        {values.map((value) => <button type="button" key={value} className={selected.includes(value) ? 'selected' : ''} onClick={() => onToggle(value)}>{value}</button>)}
      </div>
    </div>
  );
}

function CourseGrid({ courses, title }) {
  return (
    <div className="course-block">
      {title && <h2>{title}</h2>}
      <div className="course-grid">{courses.map((course) => <CourseCard key={course.id} course={course} />)}</div>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <article className="course-card" onClick={() => window.open(course.url, '_blank', 'noopener,noreferrer')}>
      <div className="course-topline"><span>{course.category}</span><span>{course.provider}</span></div>
      <div className="level-pill">{course.level}</div>
      <h3>{course.title}</h3>
      <p>{course.subtitle}</p>
      <div className="instructor">By {course.instructor}</div>
      <div className="meta">
        <span><Star size={16} fill="currentColor" /> {course.rating}</span>
        <span><Users size={16} /> {course.students.toLocaleString()}</span>
        <span><Clock size={16} /> {course.hours}h</span>
      </div>
      <div className="tags">{course.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="card-footer"><strong>{course.price}</strong><a href={course.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>View course <ExternalLink size={15} /></a></div>
      <div className="highlight"><CheckCircle2 size={16} /> {course.highlight}</div>
    </article>
  );
}

function MiniCourse({ course }) {
  return (
    <a className="mini-course" href={course.url} target="_blank" rel="noreferrer">
      <div><strong>{course.title}</strong><span>{course.provider} · {course.level} · {course.hours} hours</span></div>
      <span className="rating"><Star size={14} fill="currentColor" /> {course.rating}</span>
    </a>
  );
}

function Path({ path, selected, onSelect }) {
  return <button className={`path-card ${selected ? 'selected' : ''}`} onClick={onSelect}>{path.icon}<h3>{path.title}</h3><p>{path.description}</p></button>;
}

createRoot(document.getElementById('root')).render(<App />);
