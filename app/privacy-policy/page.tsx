import Footer from "@/components/sections/Footer";
import { HeroSection } from "../components/common/HeroSection";
import Header from "../components/header";

export default function PrivacyPolicyRoute() {
  return (
    <>
      <Header />
      <HeroSection title="প্রাইভেসি পলিসি" />
      <section className="relative lg:py-24 py-16">
        <div className="container">
          <div className="md:flex justify-center">
            <div className="md:w-3/4">
              <div className="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-md">
                <div>
                  <p className="text-slate-800">
                    NIBAY (&quot;অ্যাপ&quot;) আপনার গোপনীয়তা রক্ষা করতে
                    প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে কীভাবে
                    আমরা আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি যখন আপনি
                    অ্যাপটি ব্যবহার করেন | অ্যাপটি ব্যবহার করে, আপনি এই নীতিতে
                    বর্ণিত পদ্ধতিগুলোর প্রতি সম্মতি প্রদান করছেন।
                  </p>
                  <div className="mt-6">
                    <h3 className="font-semibold">
                      আমরা যে তথ্যগুলি সংগ্রহ করি
                    </h3>

                    <div className="mt-3 space-y-5">
                      <p className="text-slate-800">
                        <strong>ব্যক্তিগত তথ্য:</strong> নিবন্ধনের সময়, আমরা
                        আপনার নাম, ঠিকানা, অভিজ্ঞতা, ড্রাইভিং লাইসেন্স নম্বর,
                        জাতীয় আইডি (NID) এবং প্রোফাইল ছবির মতো ব্যক্তিগত
                        বিস্তারিত তথ্য সংগ্রহ করি।
                      </p>
                      <p className="text-slate-800">
                        <strong>দস্তাবেজ:</strong> আপনার যোগ্যতা যাচাই এবং
                        চাকরির আবেদনের জন্য প্রয়োজনীয় দস্তাবেজের (যেমন,
                        ড্রাইভিং লাইসেন্স, NID, ট্রান্সক্রিপ্ট) কপিও আমরা সংগ্রহ
                        করি।
                      </p>
                      <p className="text-slate-800">
                        <strong>ডিভাইস তথ্য:</strong> অ্যাপের অপটিমাইজেশনের জন্য
                        আমরা ডিভাইস তথ্য যেমন আইপি ঠিকানা, ডিভাইস টাইপ এবং
                        অপারেটিং সিস্টেম সংস্করণ সংগ্রহ করতে পারি ।
                      </p>
                      <p className="text-slate-800">
                        <strong>ব্যবহারের তথ্য:</strong> ব্যবহারকারীর অভিজ্ঞতা
                        এবং অ্যাপের কার্যকারিতা উন্নত করার জন্য আমরা চাকরির
                        অনুসন্ধান, আবেদন এবং বিজ্ঞপ্তির মতো অ্যাপের সাথে সংযোগের
                        ট্র্যাক রাখি।
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold">
                      আপনার তথ্য কিভাবে ব্যবহার করি
                    </h3>

                    <div className="mt-3 space-y-5">
                      <p className="text-slate-800">
                        <strong>অ্যাকাউন্ট তৈরি ও যাচাইকরণ:</strong> আপনার
                        অ্যাকাউন্ট সেট আপ এবং রক্ষণাবেক্ষণ করতে, আপনার পরিচয়
                        যাচাই করতে এবং সুরক্ষিত অ্যাক্সেস প্রদান করতে।
                      </p>
                      <p className="text-slate-800">
                        <strong>চাকরির আবেদন ও বিজ্ঞপ্তি:</strong> চাকরির
                        অনুসন্ধান, আবেদন এবং চাকরি সংক্রান্ত আপডেট এবং আবেদন
                        স্থিতির বিষয়ে আপনাকে জানাতে।
                      </p>
                      <p className="text-slate-800">
                        <strong>যোগাযোগ:</strong> আপডেট, সহায়তা অনুরোধ এবং
                        অ্যাপ বা নীতিতে যে কোনও পরিবর্তনের বিষয়ে আপনার সাথে
                        যোগাযোগ করতে।
                      </p>
                      <p className="text-slate-800">
                        <strong>সেবার উন্নতি:</strong> ব্যবহারকারী গতিবিধি
                        বিশ্লেষণ করে অ্যাপের বৈশিষ্ট্য, কর্মক্ষমতা এবং
                        ব্যবহারযোগ্যতা উন্নত করতে।
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold">
                      আপনার তথ্য কিভাবে শেয়ার করি
                    </h3>

                    <div className="mt-3 space-y-5">
                      <p className="text-slate-800">
                        <strong>নিয়োগকর্তাদের সাথে:</strong> আপনার চাকরির আবেদন
                        সম্পর্কিত তথ্য, আপনার প্রোফাইল এবং ডকুমেন্ট সহ সম্ভাব্য
                        নিয়োগকর্তাদের সাথে শেয়ার করা হয়।
                      </p>
                      <p className="text-slate-800">
                        <strong>সার্ভিস প্রদানকারীরা:</strong> আমরা তৃতীয়
                        পক্ষের সার্ভিস প্রদানকারীদের সাথে তথ্য শেয়ার করতে পারি
                        যারা অ্যাপটি রক্ষণাবেক্ষণ এবং উন্নত করতে আমাদের সহায়তা
                        করে (যেমন, ক্লাউড স্টোরেজ, বিশ্লেষণ)।
                      </p>
                      <p className="text-slate-800">
                        <strong>আইনি প্রয়োজনীয়তা:</strong> আইন দ্বারা প্রয়োজন
                        হলে অথবা বৈধ আইনি অনুরোধের সাড়া হিসেবে আমরা তথ্য প্রকাশ
                        করতে পারি।
                      </p>
                      <p className="text-slate-800">
                        <strong>ডেটা সংরক্ষণ:</strong> আপনার অ্যাকাউন্ট সক্রিয়
                        থাকলে অথবা এই নীতিতে উল্লেখিত উদ্দেশ্যগুলি পূরণ করার
                        জন্য যতদিন প্রয়োজন ততদিন আমরা আপনার তথ্য সংরক্ষণ করি।
                      </p>

                      <p className="text-slate-800">
                        <strong>সুরক্ষা:</strong> আমরা আপনার ব্যক্তিগত তথ্য
                        সুরক্ষিত রাখতে এনক্রিপশন, অ্যাক্সেস নিয়ন্ত্রণ এবং
                        সুরক্ষিত স্টোরেজের মাধ্যমে যৌক্তিক পদক্ষেপ গ্রহণ করি।
                        তবে, ইন্টারনেটের মাধ্যমে কোনও তথ্য সংক্রমণের পদ্ধতি
                        সম্পূর্ণরূপে নিরাপদ নয়, এবং আমরা সম্পূর্ণ সুরক্ষা
                        গ্যারান্টি দিতে পারি না।
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold">ব্যবহারকারীর অধিকার</h3>

                    <div className="mt-3 space-y-5">
                      <p className="text-slate-800">
                        <strong>অ্যাক্সেস এবং আপডেট:</strong> আপনি অ্যাপের
                        সেটিংসে গিয়ে আপনার ব্যক্তিগত তথ্য অ্যাক্সেস, আপডেট অথবা
                        সংশোধন করতে পারেন।
                      </p>
                      <p className="text-slate-800">
                        <strong>অ্যাকাউন্ট নিষ্ক্রিয়:</strong> আপনি অ্যাপ থেকে
                        আপনার অ্যাকাউন্ট নিষ্ক্রিয় করে আপনার অ্যাকাউন্ট এবং
                        সম্পর্কিত ডেটা মুছার জন্য অনুরোধ করতে পারেন।
                      </p>
                      <p className="text-slate-800">
                        <strong>শিশুদের গোপনীয়তা:</strong> অ্যাপটি ১৮ বছরের বা
                        তার বেশি বয়সের ব্যবহারকারীদের জন্য উদ্দেশ্যপ্রণোদিত।
                        আমরা ১৮ বছরের নিচে শিশুদের থেকে তথ্য সংগ্রহ করি না। যদি
                        আমরা জানতে পারি যে ১৮ বছরের নিচের একজন শিশুর তথ্য সংগ্রহ
                        করেছি, তাহলে আমরা সেই ডেটা মুছার জন্য পদক্ষেপ গ্রহণ করব।
                      </p>
                      <p className="text-slate-800">
                        <strong>এই গোপনীয়তা নীতিতে পরিবর্তন:</strong> আমরা
                        সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। আমরা
                        অ্যাপ বা ইমেইলের মাধ্যমে যে কোনো গুরুত্বপূর্ণ পরিবর্তন
                        সম্পর্কে আপনাকে জানাব। এই ধরনের আপডেটের পরে অ্যাপটি
                        চালিয়ে যাওয়া সংশোধিত নীতির গ্রহণকে নির্দেশ করে।
                      </p>
                    </div>
                  </div>

                  <p className="mt-10">
                    <strong>যোগাযোগ করুন:</strong> এই শর্তাবলী সম্পর্কিত যেকোনো
                    প্রশ্ন বা উদ্বেগের জন্য, অনুগ্রহ করে অ্যাপের সহায়তা/সমর্থন
                    স্ক্রীন থেকে আমাদের সাথে যোগাযোগ করুন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
