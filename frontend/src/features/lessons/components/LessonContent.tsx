import type { LessonContent as LessonMain } from "../types"

interface LessonContentProps {
    content: LessonMain;
}

export const LessonContent = ({ content }: LessonContentProps) => {
    return (
        <div>
            {
                content.blocks.map((item, index) => (
                    item.type === "heading" ? <h2 key={index} className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-8 mb-4 first:mt-0">{item.text}</h2>
                        : item.type === "paragraph" ? <p key={index} className="text-slate-700 text-base md:text-lg leading-relaxed mb-4">{item.text}</p>
                            : <div key={index} className="my-6 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
                                <div className="flex items-center justify-between border-b border-slate-800">
                                    <div className="flex items-center gap-2 px-4 py-3">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                        <p className="font-medium text-sm text-slate-400">{item.filename}</p>
                                    </div>
                                    <p className="font-medium text-sm text-slate-400 uppercase mr-4">{item.language}</p>
                                </div>
                                <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-200 leading-relaxed"><code>{item.code}</code></pre>
                            </div>
                ))
            }
        </div>
    )
}