import React from "react";

interface Testimonial {
  content: string;
  author: string;
  location: string;
  initials: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    content:
      "Our trip to Rajasthan was perfectly organized by Sanskruti Travels. The accommodations were excellent, and our guide was knowledgeable and friendly. We'll definitely be using their services for our next adventure!",
    author: "Rajesh Patel",
    location: "Mumbai, India",
    initials: "RP",
    rating: 5,
  },
  {
    content:
      "We booked a customized trip to Europe through Sanskruti Travels, and it exceeded our expectations. They took care of all the details, from flights to accommodations and local tours. Highly recommended for hassle-free travel!",
    author: "Sunita Mehta",
    location: "Delhi, India",
    initials: "SM",
    rating: 5,
  },
  {
    content:
      "Our honeymoon in Bali was magical thanks to Sanskruti Travels. The romantic touches they added to our package made it extra special. The entire process from booking to return was smooth, and their WhatsApp support was very responsive.",
    author: "Ankit & Reema",
    location: "Pune, India",
    initials: "AR",
    rating: 4.5,
  },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { content, author, location, initials, rating } = testimonial;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="bg-[#F5F5F5] p-8 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400">
          {[...Array(fullStars)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          {hasHalfStar && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </div>
      </div>
      <p className="text-gray-600 mb-6 italic">"{content}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
          <span className="text-gray-600 font-medium">{initials}</span>
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#000080] font-poppins">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600">
            Read about the experiences of travelers who chose Sanskruti Travels
            for their journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
