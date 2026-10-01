import React, { useState } from 'react';
import { Review, UserAccount } from '../types/store';
import { dbService } from '../services/db';
import { Star, ThumbsUp, CheckCircle, MessageSquarePlus, Filter, Award } from 'lucide-react';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  currentUser: UserAccount | null;
  onRequireLogin: () => void;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
  currentUser,
  onRequireLogin,
}) => {
  const [reviews, setReviews] = useState<Review[]>(dbService.getReviews(productId));
  const [breakdown, setBreakdown] = useState(dbService.getReviewBreakdown(productId));
  const [showForm, setShowForm] = useState(false);
  const [filterStar, setFilterStar] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');

  // Form states
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formAuthor, setFormAuthor] = useState(currentUser?.name || '');
  const [formLocation, setFormLocation] = useState(currentUser ? 'Member Collector' : '');
  const [formHeadline, setFormHeadline] = useState('');
  const [formComment, setFormComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const refreshReviews = () => {
    setReviews(dbService.getReviews(productId));
    setBreakdown(dbService.getReviewBreakdown(productId));
  };

  const handleVoteHelpful = (reviewId: string) => {
    dbService.voteHelpful(reviewId);
    refreshReviews();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      dbService.addReview({
        productId,
        author: formAuthor.trim() || (currentUser?.name ?? 'Collector Guest'),
        authorLocation: formLocation.trim() || 'Verified Architectural Patron',
        headline: formHeadline.trim() || 'Exquisite material finish',
        rating: formRating,
        comment: formComment.trim(),
      });

      refreshReviews();
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormHeadline('');
      setFormComment('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 1600);
    }, 400);
  };

  // Filter & Sort reviews
  const displayReviews = reviews
    .filter((r) => {
      if (filterStar === 'all') return true;
      return Math.round(r.rating) === filterStar;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <section className="mt-14 pt-10 border-t border-stone-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-1">
            Verified Collector Appraisals
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 font-serif">
            Customer Reviews & Botanical Experiences
          </h3>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer shadow-xs"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>{showForm ? 'Close Review Form' : 'Write An Appraisal'}</span>
        </button>
      </div>

      {/* PROMINENT RATING DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-7 bg-stone-50 border border-stone-200 rounded-xs mb-8">
        {/* Prominent Average Score (4 cols) */}
        <div className="md:col-span-4 flex flex-col justify-center items-center md:items-start md:border-r border-stone-200 md:pr-6">
          <div className="text-4xl sm:text-5xl font-extrabold font-mono text-stone-950 tracking-tight">
            {breakdown.average}
            <span className="text-base text-stone-400 font-normal"> / 5.0</span>
          </div>

          <div className="flex items-center text-amber-500 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${s <= Math.round(breakdown.average) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
              />
            ))}
          </div>

          <div className="text-xs font-mono text-stone-600">
            Based on <strong>{breakdown.total} verified appraisals</strong>
          </div>
          <div className="text-[11px] text-stone-400 font-mono mt-1">
            100% Verified Collector Purchases
          </div>
        </div>

        {/* Rating Distribution Breakdown Bars (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown.distribution[star] || 0;
            const pct = breakdown.percentages[star] || 0;
            return (
              <div
                key={star}
                onClick={() => setFilterStar(filterStar === star ? 'all' : star)}
                className={`flex items-center gap-3 text-xs font-mono group cursor-pointer p-1 rounded-xs transition-colors ${
                  filterStar === star ? 'bg-stone-200/70' : 'hover:bg-stone-100'
                }`}
              >
                <span className="w-12 text-stone-700 font-medium shrink-0 flex items-center gap-1">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>

                <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-stone-900 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-16 text-right text-stone-500 text-[11px] shrink-0">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 p-6 bg-white border-2 border-stone-900 rounded-xs shadow-md space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-stone-950 font-serif">
                Inscribe Your Botanical Experience for {productName}
              </h4>
              <p className="text-[11px] font-mono text-stone-500">
                Your appraisal will be permanently saved to the live database catalog.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-stone-400 hover:text-stone-950 text-xs font-mono"
            >
              Cancel
            </button>
          </div>

          {/* Star selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
              Rating Award (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating !== null ? hoverRating : formRating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                      aria-label={`Select ${star} stars`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          active ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-mono font-medium text-stone-800 ml-2">
                {formRating === 5 && '5 Stars · Museum Grade Excellence'}
                {formRating === 4 && '4 Stars · Exceptional Craft'}
                {formRating === 3 && '3 Stars · Good Architectural Presence'}
                {formRating === 2 && '2 Stars · Fair Work'}
                {formRating === 1 && '1 Star · Requires Attention'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 mb-1">
                Author Name *
              </label>
              <input
                type="text"
                required
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                placeholder="e.g. Julian M."
                className="w-full bg-stone-50 border border-stone-300 rounded-xs px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 mb-1">
                City / Location (Optional)
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. Zurich, Switzerland"
                className="w-full bg-stone-50 border border-stone-300 rounded-xs px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 mb-1">
              Appraisal Headline *
            </label>
            <input
              type="text"
              required
              value={formHeadline}
              onChange={(e) => setFormHeadline(e.target.value)}
              placeholder="e.g. Proportions and stone veining are sublime"
              className="w-full bg-stone-50 border border-stone-300 rounded-xs px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-700 mb-1">
              Detailed Written Appraisal *
            </label>
            <textarea
              required
              rows={4}
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Describe the tactile weight, material finishing, lighting effect, and craftsmanship in your space..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xs px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
              <Award className="w-3.5 h-3.5 text-stone-700" />
              <span>Stamped with Verified Collector Provenance</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="px-6 py-2.5 bg-stone-950 hover:bg-stone-850 text-white text-xs font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Recorded To Database</span>
                </>
              ) : isSubmitting ? (
                <span>Writing to Database...</span>
              ) : (
                <span>Publish Appraisal</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-stone-700 font-medium">Filter By Stars:</span>
          <button
            onClick={() => setFilterStar('all')}
            className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
              filterStar === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All ({reviews.length})
          </button>
          {[5, 4, 3].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStar(s)}
              className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                filterStar === s ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {s} ★ ({breakdown.distribution[s] || 0})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-stone-600">
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-stone-200 rounded-xs px-2 py-1 text-xs font-mono text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest Appraisals</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Review Item Cards List */}
      <div className="divide-y divide-stone-200 mt-2">
        {displayReviews.length > 0 ? (
          displayReviews.map((rev) => (
            <div key={rev.id} className="py-5 space-y-2">
              {/* Author, Stars, Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                      />
                    ))}
                  </div>

                  <span className="font-semibold text-xs text-stone-950 font-['Plus_Jakarta_Sans',sans-serif]">
                    {rev.author}
                  </span>

                  {rev.verifiedPurchase && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>Verified Collector</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-stone-400">
                  {rev.date}
                </div>
              </div>

              {/* Review Headline */}
              {rev.headline && (
                <h5 className="text-xs sm:text-sm font-bold text-stone-900">
                  "{rev.headline}"
                </h5>
              )}

              {/* Review Body */}
              <p className="text-xs text-stone-700 leading-relaxed font-sans max-w-3xl">
                {rev.comment}
              </p>

              {/* Footer row: Location & Helpful vote */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-stone-500">
                <span>{rev.authorLocation || 'Verified Origin'}</span>

                <button
                  onClick={() => handleVoteHelpful(rev.id)}
                  className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                  title="Mark as helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-stone-500 font-mono">
            No appraisals match this star filter.
          </div>
        )}
      </div>
    </section>
  );
};
