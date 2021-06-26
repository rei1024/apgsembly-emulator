// http://www.plantuml.com/plantuml/uml/SoWkIImgAStDuG8oIb8LFFCoIp8JSnIWtA3IlBpCl7GeBxWalm3AT2qgoY-2idto4rDIKw0SZyIS4Y07QewkhXr4Li4Ah8mBmWCAGqssKWW6EO0BoWLAW2nHi8BO1I8GQXKm5OETOGLr3PY4smYr4A4Mv3AGi8UZJqYyVsW85qG0NOD3QbuAC3m0
@startuml
state Initial
Initial: Load○ Start× Stop×
state Running
state Stop
state Error
state Loaded
state Halted
Initial-->Loaded : Load
Loaded-->Running: Start
Running-->Stop : Stop
Stop-->Running : Start
Running-->Error: Error
Error-->Loaded: Load
Running-->Halted: HALT_OUT
Halted-->Loaded: Load
Error-->Error: Error
@enduml


@startuml
state Initial
Initial: machineがnilであるがエラーメッセージがない状態。Startは有効（ロードを同時に行う）
state ParseSuccess
ParseSuccess: パース成功状態。Startは有効
ParseFailure: パース失敗 Startは無効。Resetは有効
state Running
Running: 実行中状態 Resetは無効（要検討）
state Stop
Stop: 一時停止状態

[*]-->Initial
Initial-->ParseSuccess: startの1step
Initial-->ParseFailure: startの1step (失敗した場合)
ParseFailure-->ParseSuccess: Reset（成功した場合）
ParseFailure-->ParseFailure: Reset(失敗した場合)
ParseSuccess-->Running: startの2step startを押下でここまで遷移
Running-->Stop: Stop
Stop-->Running: Start

Stop-->ParseSuccess: 
@enduml


@startuml
state Initial

[*]-->Initial
Initial-->Running: Start(パースに成功した場合)
Initial-->ParseError: Start（パースに失敗した場合）
ParseError-->Stop: Reset(パースに成功した場合)
ParseError-->ParseError: Reset(パースに失敗した場合)
Stop-->Running: Start
Running-->Stop: Stop
Running-->Stop: Reset（パースに成功した場合）
Running-->ParseError: Reset（パースに失敗した場合）
Initial-->Stop: Reset
Running-->RuntimeError: 実行時エラー
RuntimeError-->Stop: Reset（パースに成功した場合）
RuntimeError-->ParseError: Reset（パースに失敗した場合）
Stop-->Stop: Step（実行時エラーがない場合）
Stop-->RuntimeError: Step（実行時エラーが発生した場合）
@enduml

@startuml
Initial: 初期状態
Running: 連続実行中
Stop:　連続実行停止中（パースOK）
ParseError: パースエラー
RuntimeError: 実行時エラー

[*]-->Initial
Initial-->Running: Start(パース成功)
Initial-->ParseError: Start（パース失敗）
ParseError-->Stop: Reset(パース成功)
ParseError-->ParseError: Reset(パース失敗)
Stop-->Running: Start
Running-->Stop: Stop
Running-->Stop: Reset（パース成功）
Running-->ParseError: Reset（パース失敗）
Initial-->Stop: Reset(パース成功)
Running-->RuntimeError: 実行時エラー
RuntimeError-->Stop: Reset（パース成功）
RuntimeError-->ParseError: Reset（パース失敗）
Stop-->Stop: Step（実行時エラーがない場合）
Stop-->RuntimeError: Step（実行時エラーが発生）
@enduml

@startuml
Initial: 初期状態
Running: 連続実行中
Stop:　連続実行停止中（パースOK）
ParseError: パースエラー
RuntimeError: 実行時エラー

[*]-->Initial
Initial-->Running: Start(パース成功)
Initial-->ParseError: Reset(パース失敗)
Initial-->ParseError: Start（パース失敗）
ParseError-->Stop: Reset(パース成功)
ParseError-->ParseError: Reset(パース失敗)
Stop-->Running: Start
Running-->Stop: Stop
Stop-->Stop: Reset（パース成功）
Stop-->ParseError: Reset（パース失敗）

Initial-->Stop: Reset(パース成功)
Running-->RuntimeError: 実行時エラー
RuntimeError-->Stop: Reset（パース成功）
RuntimeError-->ParseError: Reset（パース失敗）
Stop-->Stop: Step（実行時エラーがない場合）
Stop-->RuntimeError: Step（実行時エラーが発生）
@enduml

@startuml
Initial: 初期状態
Running: 連続実行中
Stop:　連続実行停止中（パースOK）
ParseError: パースエラー
RuntimeError: 実行時エラー
Halted: 正常終了

[*]-->Initial
Initial-->Running: Start(パース成功)
Initial-->ParseError: Reset or Step(パース失敗)
Initial-->ParseError: Start（パース失敗）
ParseError-->Stop: Reset(パース成功)
ParseError-->ParseError: Reset(パース失敗)
Stop-->Running: Start
Running-->Stop: Stop
Stop-->Stop: Reset（パース成功）
Stop-->ParseError: Reset（パース失敗）

Initial-->Stop: Reset or Step(パース成功)
Initial-->RuntimeError: Step(実行時エラー)
Running-->RuntimeError: 実行時エラー
RuntimeError-->Stop: Reset（パース成功）
RuntimeError-->ParseError: Reset（パース失敗）
Stop-->Stop: Step（実行時エラーがない場合）
Stop-->RuntimeError: Step（実行時エラーが発生）

Running-->Halted: 正常終了
Stop-->Halted: Step(正常終了)
Halted-->ParseError: Reset(パース失敗)
Halted-->Stop: Reset(パース成功)
@enduml
