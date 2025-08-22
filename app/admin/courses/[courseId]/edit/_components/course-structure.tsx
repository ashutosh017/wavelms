"use client";

import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";
import { NewChapterModal } from "./new-chapter-modal";
import { NewLessonModal } from "./new-lesson-modal";
import { DeleteLesson } from "./delete-lesson";
import { DeleteChapter } from "./delete-chapter";

interface iAppProps {
  data: AdminCourseSingularType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export function CourseStructure({ data }: iAppProps) {
  const initialItems =
    data.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);
  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen:
          prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
        })),
      }));
      return updatedItems;
    });
  }, [data]);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;
    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") targetChapterId = overId;
      else if (overType === "lesson")
        targetChapterId = over.data.current?.chapterId ?? null;
      if (!targetChapterId) {
        toast.error("Could not determine the chapter for rendering");
        return;
      }
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);
      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not find chapter old/new index for rendering");
        return;
      }
      const reorderedLocalChpaters = arrayMove(items, oldIndex, newIndex);
      const updatedChaptersForState = reorderedLocalChpaters.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );
      const previousItems = [...items];
      setItems(updatedChaptersForState);
      if (courseId) {
        const chaptersToUpdate = updatedChaptersForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));
        const chapterReorderPromise = () => {
          return reorderChapters(courseId, chaptersToUpdate);
        };
        toast.promise(chapterReorderPromise(), {
          loading: "Reordering chapters...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder chapters";
          },
        });
      }
      return;
    }
    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;
      if (!chapterId || chapterId !== overChapterId) {
        toast.error(
          "Lessson move between different chapters or invalid chapter Id is not allowed"
        );
        return;
      }
      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );
      if (chapterIndex === -1) {
        toast.error("Could not find chapter for lesson");
        return;
      }
      const chapterToUpdate = items[chapterIndex];
      console.log(items, chapterIndex);
      console.log("chapter to update: ", chapterToUpdate);
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );
      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        console.log(oldLessonIndex, newLessonIndex);
        toast.error("Could not find lesson for rendering");
        return;
      }
      const reorderedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );
      const updatedLessonForState = reorderedLessons.map((lesson, i) => ({
        ...lesson,
        order: i + 1,
      }));
      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      };
      const prevItems = [...items];
      setItems(newItems);
      if (courseId) {
        const lessonsToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));
        const reorderLessonsPromise = () =>
          reorderLessons(chapterId, lessonsToUpdate, courseId);
        toast.promise(reorderLessonsPromise(), {
          loading: "Reordering Lessons...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
          },
          error: () => {
            setItems(prevItems);
            return "Failed to reorder lessons";
          },
        });
      }
    }
  }
  function SortableItem({ id, children, data, className }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((item) =>
        item.id === chapterId
          ? {
              ...item,
              isOpen: !item.isOpen,
            }
          : item
      )
    );
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle> Chapters</CardTitle>
          <NewChapterModal courseId={data.id} />
        </CardHeader>
        <CardContent>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                data={{ type: "chapter" }}
                key={item.id}
                id={item.id}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            className="cursor-wrap opacity-60 hover:opacity-100 "
                            variant={"ghost"}
                            size={"icon"}
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size={"icon"}
                              variant={"ghost"}
                              className="flex items-center"
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2">
                            {item.title}
                          </p>
                        </div>
                        <DeleteChapter courseId={data.id} chapterId={item.id} />
                      </div>

                      <CollapsibleContent>
                        <div>
                          <SortableContext
                            items={item.lessons.map((l) => l.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLesson
                                      courseId={data.id}
                                      chapterId={item.id}
                                      lessonId={lesson.id}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <NewLessonModal
                              courseId={data.id}
                              chapterId={item.id}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
