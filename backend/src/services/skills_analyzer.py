from typing import Dict, List
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

class SkillsAnalyzer:
    def __init__(self, sentence_model: SentenceTransformer):
        self.sentence_model = sentence_model
        
        self.skill_categories = {
            "programming_languages": {
                "keywords": ["python", "java", "javascript", "typescript", "c++", "c#", "c", "go", "rust", 
                           "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "shell", "bash"],
                "aliases": {"js": "javascript", "ts": "typescript", "cpp": "c++"}
            },
            "web_technologies": {
                "keywords": ["react", "angular", "vue", "nextjs", "nuxt", "svelte", "html", "css", "sass", 
                           "less", "bootstrap", "tailwind", "jquery", "webpack", "vite", "parcel"],
                "aliases": {"next.js": "nextjs", "vue.js": "vue", "reactjs": "react"}
            },
            "backend_frameworks": {
                "keywords": ["django", "flask", "fastapi", "express", "nodejs", "spring", "laravel", 
                           "rails", "asp.net", "symfony", "gin", "fiber", "actix"],
                "aliases": {"node.js": "nodejs", "expressjs": "express", "ruby on rails": "rails"}
            },
            "databases": {
                "keywords": ["mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "mssql", 
                           "cassandra", "elasticsearch", "dynamodb", "firebase", "supabase"],
                "aliases": {"postgres": "postgresql", "mongo": "mongodb", "sql server": "mssql"}
            },
            "cloud_platforms": {
                "keywords": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", 
                           "jenkins", "gitlab", "github", "heroku", "vercel", "netlify"],
                "aliases": {"google cloud": "gcp", "k8s": "kubernetes"}
            },
            "data_science": {
                "keywords": ["pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", 
                           "matplotlib", "seaborn", "plotly", "jupyter", "spark", "hadoop"],
                "aliases": {"sklearn": "scikit-learn", "tf": "tensorflow"}
            },
            "mobile_development": {
                "keywords": ["react native", "flutter", "ionic", "xamarin", "android", "ios", 
                           "swift", "kotlin", "objective-c", "cordova"],
                "aliases": {"react-native": "react native", "obj-c": "objective-c"}
            },
            "devops_tools": {
                "keywords": ["git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack", 
                           "trello", "asana", "notion", "figma", "sketch"],
                "aliases": {}
            }
        }
        
        self.compute_category_embeddings()
    
    def compute_category_embeddings(self):
        self.category_embeddings = {}
        for category, data in self.skill_categories.items():
            category_texts = data["keywords"][:10] 
            embeddings = self.sentence_model.encode(category_texts)
            self.category_embeddings[category] = embeddings
            
            
    def extract_skills_with_subsections(self, text: str) -> Dict[str, List[str]]:
        
        try:
            return self.extract_explicit_subsections(text)
            
        except Exception as e:
            logger.error(f"Error extracting skills: {str(e)}")
            return {}        
            
            
    def extract_explicit_subsections(self, text: str) -> Dict[str, List[str]]:
        print(f"DEBUG: Skills analyzer input text: {text[:200]}...")
        
        sections = {}
        lines = text.split('\n')
        current_section = None
        current_skills = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            section_match = self.match_section_header(line)
            print(f"DEBUG: Line '{line}' -> matched section: {section_match}")
            
            if section_match:
                if current_section and current_skills:
                    sections[current_section] = current_skills
                    print(f"DEBUG: Saved section '{current_section}' with {len(current_skills)} skills")
                
                current_section = section_match
                current_skills = []
                
                if ':' in line:
                    parts = line.split(':', 1)
                    if len(parts) == 2 and parts[1].strip():
                        skills_text = parts[1].strip()
                        line_skills = self.extract_skills_from_line(skills_text)
                        current_skills.extend(line_skills)
                        print(f"DEBUG: Extracted {len(line_skills)} skills from header line: {line_skills}")
            
            elif current_section:
                line_skills = self.extract_skills_from_line(line)
                current_skills.extend(line_skills)
                print(f"DEBUG: Extracted {len(line_skills)} skills from content line: {line_skills}")
        
        if current_section and current_skills:
            sections[current_section] = current_skills
            print(f"DEBUG: Saved final section '{current_section}' with {len(current_skills)} skills")
        
        print(f"DEBUG: Final skills sections: {sections}")
        return sections

    def match_section_header(self, line: str) -> str:
        line_clean = line.lower().rstrip(':').rstrip('.').strip()
        
        category_patterns = {
            "programming_languages": [
                "programming language", "programming languages", "languages", 
                "coding language", "coding languages"
            ],
            "web_technologies": [
                "web technolog", "web technologies", "frontend", "front-end", 
                "web development", "web tech"
            ],
            "backend_frameworks": [
                "backend", "back-end", "server", "framework", "frameworks"
            ],
            "databases": [
                "database", "databases", "data storage", "db"
            ],
            "cloud_platforms": [
                "cloud", "platform", "platforms", "infrastructure", "devops tool"
            ],
            "devops_tools": [
                "devops", "devops tools", "tools", "development tools", 
                "version control", "version control tools"
            ],
            "development_tools": [
                "development tools", "development tool", "ide", "tools"
            ]
        }
        
        for category, keywords in category_patterns.items():
            if any(keyword in line_clean for keyword in keywords):
                return category
        
        return None
    
    
    def extract_skills_from_line(self, line:str) -> List[str]:
        separator = [',', '•', '●', '▪', '◦', '|', ';', '/', '\t']
        split_line = [line]
        
        for sep in separator:
            new_split = []
            for word in split_line:
                new_split.extend(word.split(sep))
            split_line = new_split
        
        skills = []
        for word in split_line:
            skill = word.strip()
            
            if (skill and len(skill) > 1 and not skill.isdigit()):
                skills.append(skill)
        return skills
    
    
    