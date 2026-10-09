const projectsContainer = document.getElementById("projects");

const username = "Shon-101"; // 例如 "your-github-username"

const GITHUB_TOKEN = "";
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const img = document.createElement("img");
  img.src =
    project.imageUrl ||
    "https://via.placeholder.com/400x250/343a40/ffffff?text=Project";
  img.alt = `${project.title} 的预览图`;
  img.loading = "lazy";

  const content = document.createElement("div");
  content.className = "project-card-content";

  const title = document.createElement("h2");
  title.textContent = project.title;

  const desc = document.createElement("p");
  desc.textContent = project.description || "暂无描述。";

  const link = document.createElement("a");
  link.href = project.url || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "查看仓库";

  content.appendChild(title);
  content.appendChild(desc);
  content.appendChild(link);

  card.appendChild(img);
  card.appendChild(content);

  return card;
}

const headers = {
  Accept: "application/vnd.github+json"
};

if (GITHUB_TOKEN.trim() !== "") {
  headers.Authorization = `token ${GITHUB_TOKEN}`;
}
projectsContainer.innerHTML = '<p class="loading">正在加载 GitHub 项目...</p>';

fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
  headers: headers
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`GitHub API error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);

    projectsContainer.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      projectsContainer.innerHTML =
        '<p class="loading">该用户暂无公开仓库。</p>';
      return;
    }

    data.forEach(repo => {
        const project = {
        title: repo.name,
        description: repo.description || "No description provided.",
        imageUrl: `https://via.placeholder.com/400x250/343a40/ffffff?text=${encodeURIComponent(
          repo.name
        )}`,
        url: repo.html_url
      };

      const newCard = createProjectCard(project);
      projectsContainer.appendChild(newCard);
    });
  })
  .catch(error => {
    console.error("Error fetching data:", error);
    projectsContainer.innerHTML = `<p class="error">加载失败：${error.message}</p>`;
  });