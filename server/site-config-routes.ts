import { Router, Request, Response } from "express";
import { db } from "./db";
import { 
  navigationMenus, navigationMenuItems, 
  footerSections, footerLinks, 
  staticPages, homepageSections,
  siteSettings
} from "@shared/schema";
import { eq, asc } from "drizzle-orm";

const router = Router();

// ============================================================================
// NAVIGATION MENUS
// ============================================================================

router.get("/navigation", async (_req: Request, res: Response) => {
  try {
    const menus = await db.select().from(navigationMenus).where(eq(navigationMenus.isActive, true));
    const items = await db.select().from(navigationMenuItems).orderBy(asc(navigationMenuItems.sortOrder));
    
    const menusWithItems = menus.map(menu => ({
      ...menu,
      items: items.filter(item => item.menuId === menu.id)
    }));
    
    res.json(menusWithItems);
  } catch (error) {
    console.error("Error fetching navigation:", error);
    res.status(500).json({ error: "Failed to fetch navigation" });
  }
});

router.get("/navigation/:slug", async (req: Request, res: Response) => {
  try {
    const [menu] = await db.select().from(navigationMenus).where(eq(navigationMenus.slug, req.params.slug));
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }
    
    const items = await db.select()
      .from(navigationMenuItems)
      .where(eq(navigationMenuItems.menuId, menu.id))
      .orderBy(asc(navigationMenuItems.sortOrder));
    
    res.json({ ...menu, items });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

router.post("/navigation", async (req: Request, res: Response) => {
  try {
    const [menu] = await db.insert(navigationMenus).values(req.body).returning();
    res.json(menu);
  } catch (error) {
    console.error("Error creating menu:", error);
    res.status(500).json({ error: "Failed to create menu" });
  }
});

router.put("/navigation/:id", async (req: Request, res: Response) => {
  try {
    const [menu] = await db.update(navigationMenus)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(navigationMenus.id, req.params.id))
      .returning();
    res.json(menu);
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ error: "Failed to update menu" });
  }
});

router.post("/navigation/:menuId/items", async (req: Request, res: Response) => {
  try {
    const [item] = await db.insert(navigationMenuItems).values({
      ...req.body,
      menuId: req.params.menuId
    }).returning();
    res.json(item);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

router.put("/navigation/items/:id", async (req: Request, res: Response) => {
  try {
    const [item] = await db.update(navigationMenuItems)
      .set(req.body)
      .where(eq(navigationMenuItems.id, req.params.id))
      .returning();
    res.json(item);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

router.delete("/navigation/items/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(navigationMenuItems).where(eq(navigationMenuItems.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

router.put("/navigation/items/reorder", async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: { id: string; sortOrder: number }[] };
    for (const item of items) {
      await db.update(navigationMenuItems)
        .set({ sortOrder: item.sortOrder })
        .where(eq(navigationMenuItems.id, item.id));
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error reordering menu items:", error);
    res.status(500).json({ error: "Failed to reorder menu items" });
  }
});

// ============================================================================
// FOOTER
// ============================================================================

router.get("/footer", async (_req: Request, res: Response) => {
  try {
    const sections = await db.select().from(footerSections).where(eq(footerSections.isActive, true)).orderBy(asc(footerSections.sortOrder));
    const links = await db.select().from(footerLinks).where(eq(footerLinks.isActive, true)).orderBy(asc(footerLinks.sortOrder));
    
    const sectionsWithLinks = sections.map(section => ({
      ...section,
      links: links.filter(link => link.sectionId === section.id)
    }));
    
    res.json(sectionsWithLinks);
  } catch (error) {
    console.error("Error fetching footer:", error);
    res.status(500).json({ error: "Failed to fetch footer" });
  }
});

router.post("/footer/sections", async (req: Request, res: Response) => {
  try {
    const [section] = await db.insert(footerSections).values(req.body).returning();
    res.json(section);
  } catch (error) {
    console.error("Error creating footer section:", error);
    res.status(500).json({ error: "Failed to create footer section" });
  }
});

router.put("/footer/sections/:id", async (req: Request, res: Response) => {
  try {
    const [section] = await db.update(footerSections)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(footerSections.id, req.params.id))
      .returning();
    res.json(section);
  } catch (error) {
    console.error("Error updating footer section:", error);
    res.status(500).json({ error: "Failed to update footer section" });
  }
});

router.delete("/footer/sections/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(footerSections).where(eq(footerSections.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting footer section:", error);
    res.status(500).json({ error: "Failed to delete footer section" });
  }
});

router.post("/footer/links", async (req: Request, res: Response) => {
  try {
    const [link] = await db.insert(footerLinks).values(req.body).returning();
    res.json(link);
  } catch (error) {
    console.error("Error creating footer link:", error);
    res.status(500).json({ error: "Failed to create footer link" });
  }
});

router.put("/footer/links/:id", async (req: Request, res: Response) => {
  try {
    const [link] = await db.update(footerLinks)
      .set(req.body)
      .where(eq(footerLinks.id, req.params.id))
      .returning();
    res.json(link);
  } catch (error) {
    console.error("Error updating footer link:", error);
    res.status(500).json({ error: "Failed to update footer link" });
  }
});

router.delete("/footer/links/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(footerLinks).where(eq(footerLinks.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting footer link:", error);
    res.status(500).json({ error: "Failed to delete footer link" });
  }
});

// ============================================================================
// STATIC PAGES
// ============================================================================

router.get("/pages", async (_req: Request, res: Response) => {
  try {
    const pages = await db.select().from(staticPages);
    res.json(pages);
  } catch (error) {
    console.error("Error fetching static pages:", error);
    res.status(500).json({ error: "Failed to fetch static pages" });
  }
});

router.get("/pages/:slug", async (req: Request, res: Response) => {
  try {
    const [page] = await db.select().from(staticPages).where(eq(staticPages.slug, req.params.slug));
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ error: "Failed to fetch page" });
  }
});

router.post("/pages", async (req: Request, res: Response) => {
  try {
    const [page] = await db.insert(staticPages).values(req.body).returning();
    res.json(page);
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ error: "Failed to create page" });
  }
});

router.put("/pages/:id", async (req: Request, res: Response) => {
  try {
    const [page] = await db.update(staticPages)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(staticPages.id, req.params.id))
      .returning();
    res.json(page);
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ error: "Failed to update page" });
  }
});

router.delete("/pages/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(staticPages).where(eq(staticPages.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ error: "Failed to delete page" });
  }
});

// ============================================================================
// HOMEPAGE SECTIONS
// ============================================================================

router.get("/homepage", async (_req: Request, res: Response) => {
  try {
    const sections = await db.select().from(homepageSections).where(eq(homepageSections.isActive, true)).orderBy(asc(homepageSections.sortOrder));
    res.json(sections);
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
    res.status(500).json({ error: "Failed to fetch homepage sections" });
  }
});

router.post("/homepage", async (req: Request, res: Response) => {
  try {
    const [section] = await db.insert(homepageSections).values(req.body).returning();
    res.json(section);
  } catch (error) {
    console.error("Error creating homepage section:", error);
    res.status(500).json({ error: "Failed to create homepage section" });
  }
});

router.put("/homepage/:id", async (req: Request, res: Response) => {
  try {
    const [section] = await db.update(homepageSections)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(homepageSections.id, req.params.id))
      .returning();
    res.json(section);
  } catch (error) {
    console.error("Error updating homepage section:", error);
    res.status(500).json({ error: "Failed to update homepage section" });
  }
});

router.delete("/homepage/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(homepageSections).where(eq(homepageSections.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting homepage section:", error);
    res.status(500).json({ error: "Failed to delete homepage section" });
  }
});

// ============================================================================
// SITE SETTINGS (using existing key-value pattern)
// ============================================================================

router.get("/settings", async (_req: Request, res: Response) => {
  try {
    const settings = await db.select().from(siteSettings);
    const settingsMap: Record<string, unknown> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    res.json(settingsMap);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/settings/:key", async (req: Request, res: Response) => {
  try {
    const { value, category, description } = req.body;
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, req.params.key));
    
    if (existing.length > 0) {
      const [setting] = await db.update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, req.params.key))
        .returning();
      res.json(setting);
    } else {
      const [setting] = await db.insert(siteSettings).values({
        key: req.params.key,
        value,
        category: category || "general",
        description
      }).returning();
      res.json(setting);
    }
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});

export function registerSiteConfigRoutes(app: Router) {
  app.use("/api/site-config", router);
  console.log("[SiteConfig] Routes registered at /api/site-config/*");
}
