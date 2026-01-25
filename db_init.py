from app import app
from extensions import db
from models.blog import Category, Tag, BlogPost
from datetime import datetime


def seed_data():
    with app.app_context():

        if Category.query.first():
            print("✔ Data already exists. Skipping seeding.")
            return

        # ===== CATEGORIES =====
        web = Category(name="Web Development", slug="web-development")
        ai = Category(name="AI & ML", slug="ai-ml")
        cloud = Category(name="Cloud Computing", slug="cloud-computing")

        db.session.add_all([web, ai, cloud])
        db.session.commit()

        # ===== TAGS =====
        tags = [
            Tag(name="Flask", slug="flask"),
            Tag(name="SEO", slug="seo"),
            Tag(name="AI", slug="ai"),
            Tag(name="Cloud", slug="cloud"),
        ]
        db.session.add_all(tags)
        db.session.commit()

        # ===== BLOG POSTS =====
        posts = [
            BlogPost(
                title="Why Flask Is Perfect for Startups",
                slug="why-flask-is-perfect-for-startups",
                summary="Flask offers flexibility, simplicity, and scalability for startups.",
                content="<p>Flask is lightweight, flexible, and ideal for rapid development.</p>",
                featured_image="images/blogs/web.webp",
                author_name="Sadiq Ali",
                seo_title="Why Flask Is Best for Startups | Nexa Solutions",
                seo_description="Discover why Flask is a top choice for startup web development.",
                category=web,
                tags=[tags[0], tags[1]],
                is_published=True,
                published_at=datetime.utcnow()
            ),

            BlogPost(
                title="How AI Is Transforming Businesses",
                slug="how-ai-is-transforming-businesses",
                summary="AI is revolutionizing industries through automation and intelligence.",
                content="<p>AI enables smarter decision-making and automation.</p>",
                featured_image="images/blogs/ai.webp",
                author_name="John Doe",
                seo_title="AI Transforming Businesses in 2026",
                seo_description="Explore real-world AI applications for modern businesses.",
                category=ai,
                tags=[tags[2]],
                is_published=True,
                published_at=datetime.utcnow()
            ),

            BlogPost(
                title="Cloud Migration: Things You Must Know",
                slug="cloud-migration-things-you-must-know",
                summary="A complete guide to successful cloud migration.",
                content="<p>Cloud migration improves scalability and reduces costs.</p>",
                featured_image="images/blogs/cloud.webp",
                author_name="Jane Smith",
                seo_title="Cloud Migration Guide | Nexa Solutions",
                seo_description="Essential tips for cloud migration success.",
                category=cloud,
                tags=[tags[3]],
                is_published=True,
                published_at=datetime.utcnow()
            ),
        ]

        db.session.add_all(posts)
        db.session.commit()

        print("✅ Dummy blog data inserted successfully.")


if __name__ == "__main__":
    seed_data()
