import React, { useContext, useState, useEffect } from "react";

// COMPONENTS
import WrongPage from "../../../errors/WrongPage";
import NoData from "../../../errors/NoData";
import Loading from "../../loading/Loading";
import { Context } from "../../../data/Context";
import Semester from "./Semester";
import StudentGrade from "./StudentGrade";

// NPMS
import $ from "jquery";
import { useSearchParams } from "react-router-dom";

// HOOKS
import useFetch from "../../../hooks/useFetch";
import useLoad from "../../../hooks/useLoad";
import useComponent from "../../../hooks/useComponent";
import useNavbar from "../../../hooks/useNavbar";

// FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

library.add(faChevronDown);

const Teacher = () => {
  // STATE
  const { state, dispatch } = useContext(Context);
  // IS LOAD
  const isLoad = useLoad();
  // COMPONENT
  const component = useComponent();
  // SHOULD I FETCH?
  const [isFetch, setIsFetch] = useState(true);
  // FETCH VARS
  const [fetchVars, setFetchVars] = useState({
    url: "",
    body: "",
    action: "",
    searchParams: "",
  });
  // QUERY
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (component) {
      setFetchVars({
        url: `${state.url.teachers}/${state.ID}`,
        body: "",
        action: "get",
        searchParams,
      });
    }
  }, [state.url, isFetch, component, state.ID]);

  const clickHandle = (e) => {
    const query = $(e.currentTarget)
      .siblings(".lessonName")
      .html()
      .replace(/ /g, "_");
    // SET QUERY
    setSearchParams((searchParams) => {
      searchParams.set("lesson", query);
      return searchParams;
    });
    // GET STUDENTS
    setFetchVars({
      url: state.url.students,
      body: "",
      action: "get",
      searchParams,
    });
    $(".studentsDiv").css("display", "none");
    $(e.currentTarget).parent().siblings(".studentsDiv").css("display", "grid");
    // ! IS FETCH SET MAYBE
  };

  console.log(state.studentData);

  // SET SELECTED BUTTON COLOR
  useNavbar(component, isLoad);
  // AXIOS CALL
  useFetch(
    fetchVars.url,
    fetchVars.body,
    fetchVars.action,
    fetchVars.searchParams,
    isFetch
  );
  console.log(state.selectedSemester);
  return (
    <>
      {component !== "lessons" && component !== "account" ? (
        <WrongPage />
      ) : !state.teachersData && !isLoad ? (
        <Loading />
      ) : !state.teachersData ? (
        <NoData />
      ) : (
        <section
          id="teacherSection"
          onClick={() => dispatch({ type: "IS_NAVBAR", payload: false })}
        >
          <Semester />
          <div
            id="lessonsSection"
            onClick={() => dispatch({ type: "IS_SEMESTER", payload: false })}
          >
            <article id="lessonContainer">
              {state.teachersData.branches && state.selectedSemester ? (
                state.teachersData.branches.map((branch) => {
                  const { lesson, semester } = branch;
                  if (semester == state.selectedSemester) {
                    return (
                      <article className="lessons" key={lesson + semester}>
                        <div className="lessonDiv">
                          <div className="lessonName">{lesson}</div>
                          <div
                            className="slideDown"
                            onMouseEnter={(e) =>
                              $(e.target).children().css("color", "white")
                            }
                            onMouseLeave={(e) =>
                              $(e.target).children().css("color", "black")
                            }
                            onClick={(e) => clickHandle(e)}
                          >
                            <FontAwesomeIcon
                              icon="fa-chevron-down"
                              className="icon downIcon"
                            />
                          </div>
                        </div>
                        <StudentGrade />
                      </article>
                    );
                  }
                })
              ) : (
                <div>CONTACT WITH ADMIN TO ADD LESSONS</div>
              )}
            </article>
          </div>
        </section>
      )}
    </>
  );
};

export default Teacher;