/**
 * Pushes the content bundled with the deployment into the database.
 *
 * Content is authored in the repo as JSON and served from Postgres, and
 * scripts/migrate-to-db.mjs normally carries it across. That script only
 * works from a machine that can reach the database, which this one cannot —
 * the Neon endpoint times out on her network, over both WebSocket and HTTPS.
 * Vercel has no such problem, so the import runs there instead: the admin
 * presses a button and the deployed instance does the write.
 *
 * The JSON is imported statically rather than read from disk, because files
 * outside public/ are not guaranteed to survive into a serverless bundle.
 *
 * Upsert only — nothing is deleted, so rows created in the panel survive an
 * import of the repo content.
 */
import "server-only";
import {
  upsertArticle,
  upsertProject,
  type StoredArticle,
  type StoredProject,
} from "@/lib/content-store";
import projectsJson from "../../data/projects.json";
import articlesJson from "../../data/articles.json";

export type SyncReport = {
  projects: number;
  articles: number;
  failed: string[];
};

export async function syncContentFromBundle(): Promise<SyncReport> {
  const report: SyncReport = { projects: 0, articles: 0, failed: [] };

  for (const project of projectsJson as unknown as StoredProject[]) {
    try {
      await upsertProject(project);
      report.projects++;
    } catch (error) {
      report.failed.push(
        `project ${project.slug}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  for (const article of articlesJson as unknown as StoredArticle[]) {
    try {
      await upsertArticle(article);
      report.articles++;
    } catch (error) {
      report.failed.push(
        `article ${article.slug}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return report;
}
