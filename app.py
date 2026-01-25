from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Message
from extensions import db, mail
from dotenv import load_dotenv
from flask_login import (
    LoginManager,
    UserMixin,
    current_user
)
from admin.routes import admin_bp
from models import BlogPost, Category
import os
from datetime import datetime

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("SECRET_KEY", "change-this")

# ================= MAIL CONFIG =================
# ================= MAIL CONFIG =================
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")  # sadiqali8791@gmail.com
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")  # betz_ynfk_hvzl_cews
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")  # Just the email, not tuple
mail.init_app(app)

print("MAIL_USERNAME =", app.config["MAIL_USERNAME"])
print("MAIL_PASSWORD EXISTS =", bool(app.config["MAIL_PASSWORD"]))

# ============================
# FLASK-LOGIN SETUP
# ============================
login_manager = LoginManager()
login_manager.login_view = "admin.login"
login_manager.init_app(app)

class AdminUser(UserMixin):
    id = 1  # single admin user

@login_manager.user_loader
def load_user(user_id):
    return AdminUser()

# ============================
# REGISTER BLUEPRINT
# ============================
app.register_blueprint(admin_bp)

# ============================
# DB INIT
# ============================
db.init_app(app)

# with app.app_context():
#     db.create_all()
#     print("Database tables created")

# ============================
# PUBLIC ROUTES
# ============================
@app.route("/")
def home():
    return render_template("pages/index.html")

@app.route("/services")
def services():
    return render_template("pages/services.html")

@app.route("/blog")
def blog():
    page = request.args.get("page", 1, type=int)

    featured_post = (
        BlogPost.query
        .filter_by(is_published=True)
        .order_by(BlogPost.published_at.desc())
        .first()
    )

    posts = (
        BlogPost.query
        .filter_by(is_published=True)
        .order_by(BlogPost.published_at.desc())
        .paginate(page=page, per_page=4, error_out=False)
    )

    categories = (
        db.session.query(Category, db.func.count(BlogPost.id))
        .join(BlogPost)
        .filter(BlogPost.is_published == True)
        .group_by(Category.id)
        .all()
    )

    recent_posts = (
        BlogPost.query
        .filter_by(is_published=True)
        .order_by(BlogPost.published_at.desc())
        .limit(10)
        .all()
    )

    return render_template(
        "pages/blog.html",
        featured_post=featured_post,
        posts=posts,
        categories=categories,
        recent_posts=recent_posts
    )

@app.route("/blog/<slug>")
def blog_detail(slug):
    post = BlogPost.query.filter_by(
        slug=slug,
        is_published=True
    ).first_or_404()

    # increase view count
    post.view_count += 1
    db.session.commit()

    # =========================
    # RELATED POSTS (same category)
    # =========================
    related_posts = (
        BlogPost.query
        .filter(
            BlogPost.category_id == post.category_id,
            BlogPost.id != post.id,
            BlogPost.is_published == True
        )
        .order_by(BlogPost.published_at.desc())
        .limit(3)
        .all()
    )

    # =========================
    # POPULAR POSTS (by views)
    # =========================
    popular_posts = (
        BlogPost.query
        .filter(BlogPost.is_published == True)
        .order_by(BlogPost.view_count.desc())
        .limit(5)
        .all()
    )

    # =========================
    # CATEGORY COUNTS
    # =========================
    categories = (
        db.session.query(
            Category,
            db.func.count(BlogPost.id).label("post_count")
        )
        .join(BlogPost)
        .filter(BlogPost.is_published == True)
        .group_by(Category.id)
        .all()
    )

    return render_template(
        "pages/blog_detail.html",
        post=post,
        related_posts=related_posts,
        popular_posts=popular_posts,
        categories=[
            {
                "name": c.name,
                "post_count": count
            }
            for c, count in categories
        ]
    )


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        data = {
            "name": request.form.get("name", "").strip(),
            "email": request.form.get("email", "").strip(),
            "phone": request.form.get("phone", "").strip(),
            "subject": request.form.get("subject", "").strip() or "New Contact Form",
            "message": request.form.get("message", "").strip(),
        }

        if not all([data["name"], data["email"], data["phone"], data["message"]]):
            flash("Please fill all required fields.", "error")
            return redirect(url_for("contact"))

        try:
            msg = Message(
                subject=f"Contact Form: {data['subject']}",
                sender=app.config["MAIL_USERNAME"],
                recipients=["contact@nexa-solutions.in"],
                reply_to=data["email"],
                body=f"""
Name: {data['name']}
Email: {data['email']}
Phone: {data['phone']}
Subject: {data['subject']}

Message:
{data['message']}

Sent from: {request.host_url}contact
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
""",
            )
            mail.send(msg)
            flash("Your message has been sent successfully.", "success")
        except Exception:
            flash("Your message has been received.", "success")

        return redirect(url_for("contact"))

    return render_template("pages/contact.html")
    

@app.route("/about")
def about():
    return render_template("pages/about.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

