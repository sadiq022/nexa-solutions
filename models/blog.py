from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from extensions import db


# ============================
# CATEGORIES
# ============================
class Category(db.Model):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)

    posts = relationship(
        "BlogPost",
        back_populates="category"
    )

    def __repr__(self):
        return f"<Category {self.name}>"


# ============================
# BLOG POSTS (SEO CORE)
# ============================
class BlogPost(db.Model):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True)

    # ===== CONTENT =====
    title = Column(String(255), nullable=False)
    slug = Column(String(300), unique=True, nullable=False)

    summary = Column(Text, nullable=False)       # Used for SEO + listings
    content = Column(Text, nullable=False)       # Full HTML / Markdown

    featured_image = Column(String(300))

    # ===== AUTHOR (TEXT ONLY) =====
    author_name = Column(String(120), nullable=False)

    # ===== SEO =====
    seo_title = Column(String(255))
    seo_description = Column(String(300))

    # ===== RELATIONS =====
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False
    )

    # ===== PUBLISHING =====
    is_published = Column(Boolean, default=False, index=True)
    published_at = Column(DateTime, index=True)

    view_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    category = relationship("Category", back_populates="posts")

    __table_args__ = (
        Index("idx_blog_slug", "slug"),
        Index("idx_blog_published", "is_published", "published_at"),
    )

    def __repr__(self):
        return f"<BlogPost {self.title}>"
