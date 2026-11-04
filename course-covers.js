// Enhances the existing course renderer with distinct photographic covers.
const originalCourseRender = render;
render = function () {
  originalCourseRender();
  const visible = filtered().slice(0, limit);
  document.querySelectorAll('.course-card').forEach((card, index) => {
    const course = visible[index];
    const cover = card.querySelector('.card-cover');
    cover.style.backgroundImage = `linear-gradient(130deg,${course.color}aa,#10152caa), url('${covers[course.id % covers.length]}')`;
    cover.style.backgroundPosition = `${25 + (course.id * 17) % 55}% ${20 + (course.id * 29) % 55}%`;
    cover.style.backgroundSize = 'cover';
    // The background image is loaded by the browser itself. Creating a second
    // Image object for every render made filters and searches feel sluggish.
  });
};
render();
