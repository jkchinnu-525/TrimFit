export default function Footer() {
  return (
    <footer id="footer" className="py-12">
      <div className=" w-screen mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="ml-2 sm:ml-12 items-center">
          <div
            className="bg-[50%_50%] bg-cover bg-no-repeat h-[52px] w-[140px]"
            style={{ backgroundImage: "url(/Image.png)" }}
          />
          <div className="mb-12 ml-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-md">
              <div className="relative flex flex-row">
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  className="relative w-full pl-5 pr-36 py-4 bg-gray-100 rounded-2xl placeholder:text-left text-left text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <div className="mr-4">
                  <button className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-[#31484D] text-white px-7 py-4 rounded-2xl font-medium hover:bg-[#31484D]/90 transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <p className="text-black mt-8 pr-16 md:pr-0 text-center md:text-left md:mt-4  text-wrap: balance text-[18px] font-'Inter' leading-relaxed max-w-md">
              Join our newsletter trusted by 1M+ Job Seekers to land their next
              role.
            </p>
          </div>
        </div>

        {/* Newsletter Section */}

        {/* Links Section */}
        <div className="grid grid-cols-3 gap-20 sm:gap-24 px-2 mr-4 sm:px-4 lg:mr-14">
          {/* Product Column */}
          <div>
            <h3 className="font-'Inter' text-black text-[12px] sm:text-[25px] font-bold sm:font-normal mb-6 tracking-tight">
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-'Inter' text-black text-[12px] sm:text-[25px] font-bold sm:font-normal mb-6 tracking-tight">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight"
                >
                  Tips & Blogs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight"
                >
                  ATS Checklist
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight"
                >
                  Our Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h3 className="font-'Inter' text-black text-[12px] sm:text-[25px] font-bold sm:font-normal mb-6 tracking-tight">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight group"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 22 20">
                    <path d="M0 0H2.5L17.5 20H15L0 0ZM4.5 0H7L22 20H19.5L4.5 0ZM2 0H7V2H2V0ZM15 18H20V20H15V18ZM17.5 0H21L4 20H0.5L17.5 0Z" />
                  </svg>
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight group"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 21 21">
                    <path d="M10.5 0C9.12112 0 7.75574 0.271591 6.48182 0.799265C5.2079 1.32694 4.05039 2.10036 3.07538 3.07538C1.10625 5.04451 0 7.71523 0 10.5C0 15.141 3.0135 19.0785 7.182 20.475C7.707 20.559 7.875 20.2335 7.875 19.95V18.1755C4.9665 18.8055 4.347 16.7685 4.347 16.7685C3.864 15.5505 3.1815 15.225 3.1815 15.225C2.226 14.574 3.255 14.595 3.255 14.595C4.305 14.6685 4.8615 15.6765 4.8615 15.6765C5.775 17.2725 7.3185 16.8 7.917 16.548C8.0115 15.8655 8.2845 15.4035 8.5785 15.141C6.2475 14.8785 3.801 13.9755 3.801 9.975C3.801 8.8095 4.2 7.875 4.8825 7.1295C4.7775 6.867 4.41 5.775 4.9875 4.3575C4.9875 4.3575 5.8695 4.074 7.875 5.4285C8.7045 5.1975 9.6075 5.082 10.5 5.082C11.3925 5.082 12.2955 5.1975 13.125 5.4285C15.1305 4.074 16.0125 4.3575 16.0125 4.3575C16.59 5.775 16.2225 6.867 16.1175 7.1295C16.8 7.875 17.199 8.8095 17.199 9.975C17.199 13.986 14.742 14.868 12.4005 15.1305C12.7785 15.456 13.125 16.0965 13.125 17.073V19.95C13.125 20.2335 13.293 20.5695 13.8285 20.475C17.997 19.068 21 15.141 21 10.5C21 9.12112 20.7284 7.75574 20.2007 6.48182C19.6731 5.20791 18.8996 4.05039 17.9246 3.07538C16.9496 2.10036 15.7921 1.32694 14.5182 0.799265C13.2443 0.271591 11.8789 0 10.5 0Z" />
                  </svg>
                  Github
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-black font-'Inter' font-regular text-[10px] sm:text-[18px] hover:text-gray-600 transition-colors tracking-tight group"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 18 18">
                    <path d="M16 0C16.5304 0 17.0391 0.210714 17.4142 0.585786C17.7893 0.960859 18 1.46957 18 2V16C18 16.5304 17.7893 17.0391 17.4142 17.4142C17.0391 17.7893 16.5304 18 16 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 0 16.5304 0 16V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H16ZM15.5 15.5V10.2C15.5 9.33539 15.1565 8.5062 14.5452 7.89483C13.9338 7.28346 13.1046 6.94 12.24 6.94C11.39 6.94 10.4 7.46 9.92 8.24V7.13H7.13V15.5H9.92V10.57C9.92 9.8 10.54 9.17 11.31 9.17C11.6813 9.17 12.0374 9.3175 12.2999 9.58005C12.5625 9.8426 12.71 10.1987 12.71 10.57V15.5H15.5ZM3.88 5.56C4.32556 5.56 4.75288 5.383 5.06794 5.06794C5.383 4.75288 5.56 4.32556 5.56 3.88C5.56 2.95 4.81 2.19 3.88 2.19C3.43178 2.19 3.00193 2.36805 2.68499 2.68499C2.36805 3.00193 2.19 3.43178 2.19 3.88C2.19 4.81 2.95 5.56 3.88 5.56ZM5.27 15.5V7.13H2.5V15.5H5.27Z" />
                  </svg>
                  Linkedin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
