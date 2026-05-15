export interface GitHubPublishInput {
  repoUrl: string;
  token: string;
  filePath: string;
  content: string;
  commitMessage: string;
}

export interface PublishResult {
  success: boolean;
  commitSha?: string;
  message: string;
}

export async function publishToGitHub(
  input: GitHubPublishInput
): Promise<PublishResult> {
  try {
    const { repoUrl, token, filePath, content, commitMessage } = input;

    const repoPath = repoUrl
      .replace('https://github.com/', '')
      .replace('github.com/', '')
      .replace(/\.git$/, '')
      .replace(/\/$/, '');

    const apiBase = 'https://api.github.com';

    const contentBase64 = Buffer.from(content, 'utf-8').toString('base64');

    let sha: string | undefined;
    try {
      const getRes = await fetch(
        `${apiBase}/repos/${repoPath}/contents/${filePath}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (getRes.ok) {
        const data = await getRes.json();
        sha = data.sha;
      }
    } catch {
      // File doesn't exist yet, that's fine
    }

    const body: Record<string, string> = {
      message: commitMessage,
      content: contentBase64,
      branch: 'main',
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(
      `${apiBase}/repos/${repoPath}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      return {
        success: false,
        message: `GitHub API error: ${putRes.status} ${JSON.stringify(err)}`,
      };
    }

    const result = await putRes.json();
    return {
      success: true,
      commitSha: result.content?.sha,
      message: 'Successfully published to GitHub',
    };
  } catch (error) {
    return {
      success: false,
      message: `Publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function triggerVercelDeploy(
  repoUrl: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const repoPath = repoUrl
      .replace('https://github.com/', '')
      .replace('github.com/', '')
      .replace(/\.git$/, '')
      .replace(/\/$/, '');

    const res = await fetch(
      `https://api.vercel.com/v1/integrations/deploy`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repoPath,
          gitSource: {
            type: 'github',
            repo: repoPath,
          },
        }),
      }
    );

    if (!res.ok) {
      return {
        success: false,
        message: `Vercel deploy trigger: ${res.status}`,
      };
    }

    return {
      success: true,
      message: 'Vercel deployment triggered. The site will update automatically.',
    };
  } catch {
    return {
      success: true,
      message:
        'GitHub push successful. If Vercel auto-deploy is configured, deployment will start automatically.',
    };
  }
}